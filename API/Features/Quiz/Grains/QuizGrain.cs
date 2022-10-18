using API.Features.Lobby;
using API.Features.Player;
using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz.Grains;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private IPersistentState<QuizState> Game { get; set; }
    private readonly ILogger<QuizGrain> _logger;
    private IQuizPushWorker _worker;


    private const int MaxCapacity = 4;
    private int _tick;
    private IDisposable? _timer;

    private static string GrainType => nameof(QuizGrain);
    private Guid GrainKey => this.GetPrimaryKey();

    private bool AllPlayersAnswered =>
        Game.State.Scoreboard.All(p => p.Value.Answered);

    private bool AllPlayersReady =>
        Game.State.Scoreboard.All(p => p.Value.Ready); // > 2;

    public QuizGrain([PersistentState("quiz", nameof(QuizGrain))] IPersistentState<QuizState> game,
        ILogger<QuizGrain> logger)
    {
        Game = game;
        _logger = logger;
    }

    public override async Task OnActivateAsync()
    {
        Game.State.GameId = GrainKey;
        _worker = GrainFactory.GetGrain<IQuizPushWorker>(0);
        await base.OnActivateAsync();
    }

    public async Task CreateGame(Guid ownerId, QuizCreationModel settings)
    {
        if (Game.RecordExists)
            throw new InvalidOperationException("Couldn't create game, it already exist");
        Game.State.OwnerId = ownerId;
        Game.State.QuizSettings.Difficulty = settings.Difficulty;
        Game.State.QuizSettings.Type = settings.Type;
        Game.State.QuizSettings.Questions = settings.Questions;
        Game.State.Name = settings.Name;
        Game.State.Timeout = settings.Timeout;
        Game.State.GameMode = GameMode.Quiz;
        Game.State.GameStatus = GameStatus.AwaitingPlayers;
        //await _worker.OnStatusUpdate(Game.State.GameId, Game.State.GameStatus);
        //await Task.Delay(1000);
        //await SendLobbyPlayers();
        await AddPlayer(ownerId);
        await UpdateGameToLobby();
    }

    public async Task AddPlayer(Guid playerId)
    {
        if (!(Game.State.Scoreboard.Keys.Count <= 4) || Game.State.GameStatus == GameStatus.InProgress)
            throw new InvalidOperationException("Lobby full");
        var player = GrainFactory.GetGrain<IPlayerGrain>(playerId);
        await player.SetActiveGame(Game.State.GameId);
        var newPlayer = new PlayerState
        {
            Id = playerId,
            Name = await player.GetUsername(),
            Score = 0,
            Answered = false,
            AnsweredCorrectly = null,
            Ready = false
        };
        Game.State.Scoreboard[playerId] = newPlayer;
        Game.State.NumberOfPlayers = Game.State.Scoreboard.Keys.Count;
        await _worker.OnStatusUpdate(Game.State.GameId,
            Game.State.GameStatus); // configureAwait(false)? instead of delay
        //await Task.Delay(2000);
        await SendLobbyPlayers();
        await UpdateGameToLobby();
    }

    public async Task RemovePlayer(Guid playerId)
    {
        if (Game.State.Scoreboard.TryGetValue(playerId, out var value))
        {
            Game.State.Scoreboard.Remove(playerId);
            Game.State.NumberOfPlayers = Game.State.Scoreboard.Count;
            await SendLobbyPlayers();
        }

        if (Game.State.NumberOfPlayers < 2) // Potentially split up to new method?
            Game.State.GameStatus = GameStatus.AwaitingPlayers;
        await _worker.OnStatusUpdate(Game.State.GameId, Game.State.GameStatus);
        await UpdateGameToLobby();
        // If 0, disband lobby, call remove game from lobby grain
        // return Game.State.Scoreboard.Keys.Count < 1;
    }

    public async Task SubmitAnswer(Guid playerId, string answer)
    {
        EnsureGameIsInProgress();
        if (IsCorrect(answer))
        {
            Game.State.Scoreboard[playerId].Score++;
            Game.State.Scoreboard[playerId].AnsweredCorrectly = true;
        }

        Game.State.Scoreboard[playerId].Answered = true;
        await UpdateScoreboard();

        if (AllPlayersAnswered)
            await NextRound();

    }

    public async Task SetPlayerStatus(Guid playerId, bool status)
    {
        if (Game.State.Scoreboard.TryGetValue(playerId, out var value)) Game.State.Scoreboard[playerId].Ready = status;
        await SendLobbyPlayers();

        if (AllPlayersReady)
            //Game.State.GameStatus = GameStatus.Ready;
            await _worker.OnAllPlayersReady(Game.State.GameId, AllPlayersReady); // Allow creator to start game
        //await _worker.OnStatusUpdate(Game.State.GameId, Game.State.GameStatus);
    }

    public async Task StartGame(Guid playerId)
    {
        if (!AllPlayersReady && Game.State.OwnerId != playerId)
            throw new ArgumentException("Can't start game");
        //if (!AllPlayersReady) throw new ArgumentException("All players not ready");
        var client = new OpenTdbClient();
        Game.State.Questions = await client.GetQuestions(Game.State.QuizSettings);
        Game.State.QuestionStep = 1;
        Game.State.GameStatus = GameStatus.InProgress;
        // Change status to InProgress
        await _worker.OnStatusUpdate(Game.State.GameId, Game.State.GameStatus);
        // Give time for client to setup screen
        await Task.Delay(2000);

        await _worker.OnNewQuestion(Game.State.GameId, Game.State.Questions[Game.State.QuestionStep]
            .ProcessQuestion(Game.State.QuestionStep));
        await SendRuntime();
        await UpdateScoreboard();
        await UpdateGameToLobby();
    }

    private async Task UpdateGameToLobby()
    {
        var summary = new GameLobbySummary
        {
            Id = Game.State.GameId,
            Name = Game.State.Name,
            Mode = GameMode.Quiz,
            Players = Game.State.NumberOfPlayers,
            Status = Game.State.GameStatus,
            Difficulty = Game.State.QuizSettings.Difficulty
            // add category?
        };
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddOrUpdateGame(summary.Id, summary);
    }


    private async Task Tick(object arg)
    {
        if (_timer == null) return;
        _tick++;
        if (_tick == Game.State.Timeout)
            await NextRound();
        else
            await _worker.OnTimerTicked(Game.State.GameId, _tick);
    }

    private async Task Disband()
    {
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.RemoveGame(GrainKey);
    }

    /*
    private async Task ResetGame()
    {

        var players = _game.GetPlayerIds();
        foreach (var VARIABLE in players)
        {

        }

        Console.WriteLine($"Hub: Leaving game {gameId}");
        var gameGrain = GrainFactory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.RemovePlayer(GetUserId);
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.RemoveActiveGame();
        await Groups.RemoveFromGroupAsync(GetConnectionId, gameId);
        await Clients.Caller.SendAsync(WsEvents.GameFinished);


        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        Console.WriteLine("disconnected " + Context.ConnectionId);
        await player.RemoveActiveGame();
        await player.ResetConnectionId();

        // Cleanup
        var pl = await player.GetActiveGame();
        await Groups.RemoveFromGroupAsync(GetConnectionId, pl.ToString());
        await base.OnDisconnectedAsync(exception);
    }
*/

    private async Task UpdateScoreboard()
    {
        var users = Game.State.Scoreboard.Values.Select(user => new PlayerStateDto
            {
                Id = user.Id,
                Name = user.Name,
                Score = user.Score,
                Answered = user.Answered,
                AnsweredCorrectly = user.AnsweredCorrectly
            })
            .ToList();
        await _worker.OnScoreboardUpdate(Game.State.GameId, users);
    }

    private async Task SendRuntime()
    {
        var info = new QuizRuntime
        {
            //Status = Game.State.GameStatus,
            NumberOfQuestions = Game.State.QuizSettings.Questions,
            Timeout = Game.State.Timeout,
            OwnerId = Game.State.OwnerId,
            QuizSettings = Game.State.QuizSettings
        };
        await _worker.OnQuizUpdated(Game.State.GameId, info);
    }

    private async Task EndGame()
    {
        Game.State.GameStatus = GameStatus.Finished;
        await _worker.OnStatusUpdate(Game.State.GameId, Game.State.GameStatus);
        //_timer?.Dispose();
        //await Game.ClearStateAsync();
    }

    private async Task SendLobbyPlayers()
    {
        var usersReady = Game.State.Scoreboard.Values
            .Select(player => new LobbyPlayer { Id = player.Id, Name = player.Name, Ready = player.Ready })
            .ToList();
        await _worker.OnLobbyUpdated(Game.State.GameId, usersReady);
    }

    private Task CalculateAndReturnResults()
    {
        var scoreboard = Game.State.Scoreboard.Values.ToList();
        var playeresults = scoreboard.Select(player => new PlayerResult
            { Id = player.Id, Name = player.Name, Score = player.Score }).OrderByDescending(v => v.Score).ToList();
        ;
        var results = new QuizResults
        {
            Winner = playeresults.First().Name,
            Scoreboard = playeresults
        };

        return Task.FromResult(results);
    }

    private async Task NextRound()
    {
        if (Game.State.QuestionStep == Game.State.Questions.Count)
        {
            await EndGame();
        }
        else
        {
            await _worker.OnCorrectAnswer(Game.State.GameId,
                Game.State.Questions[Game.State.QuestionStep].correct_answer);
            await _worker.OnFinishQuestion(Game.State.GameId);
            await UpdateScoreboard();
            await Task.Delay(5000);

            // Reset and go next round
            foreach (var (key, value) in Game.State.Scoreboard)
            {
                Game.State.Scoreboard[key].Answered = false;
                Game.State.Scoreboard[key].AnsweredCorrectly = null;
            }

            Game.State.QuestionStep++;
            var newQuestion = Game.State.Questions[Game.State.QuestionStep].ProcessQuestion(Game.State.QuestionStep);
            await UpdateScoreboard();
            await _worker.OnNewQuestion(Game.State.GameId, newQuestion);
            //ScheduleTimer();
        }

    }

    private void ScheduleTimer()
    {
        StopTimer();
        _timer = RegisterTimer(
            Tick,
            null,
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(Game.State.Timeout));
    }

    private void StopTimer()
    {
        _tick = 0;
        _timer?.Dispose();
        _timer = null;
    }

    private bool IsCorrect(string answer)
    {
        return answer == Game.State.Questions[Game.State.QuestionStep].correct_answer;
    }

    private void EnsureGameIsInProgress()
    {
        if (Game.State.GameStatus != GameStatus.InProgress)
            throw new InvalidOperationException("Game has already ended");
    }
}