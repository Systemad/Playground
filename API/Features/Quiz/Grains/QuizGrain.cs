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

// TODO: Fix end game and score
[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private IPersistentState<QuizState> Game { get; set; }
    private readonly ILogger<QuizGrain> _logger;
    private IQuizPushWorker _worker;
    private IOpenTdbClient _client;

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
        ILogger<QuizGrain> logger, IOpenTdbClient client)
    {
        Game = game;
        _logger = logger;
        _client = client;
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
        // FIX?? shows up as one
        if (settings.Category == "1")
            Game.State.QuizSettings.Category = "random";
        else
            Game.State.QuizSettings.Category = settings.Category.ReturnCategoryString();

        Game.State.QuizSettings.Difficulty = settings.Difficulty;
        Game.State.QuizSettings.Type = settings.Type;
        Game.State.QuizSettings.Questions = settings.Questions;
        Game.State.Name = settings.Name;
        Game.State.Timeout = settings.Timeout;
        Game.State.GameMode = GameMode.Quiz;
        Game.State.GameStatus = GameStatus.AwaitingPlayers;
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
        await SendGameState();
        //await Task.Delay(1000);
        await SendLobbyPlayers();
        await UpdateGameToLobby();
    }

    public async Task RemovePlayer(Guid playerId)
    {

        if (Game.State.Scoreboard.TryRemove(playerId, out var player))
            _logger.LogInformation($"Removed player {player.Id} - {player.Name}", player.Id, player.Name);

        Game.State.NumberOfPlayers = Game.State.Scoreboard.Count;
        if (Game.State.NumberOfPlayers == 0 || Game.State.OwnerId == playerId)
        {
            await Disband();
        }
        else
        {
            if (Game.State.NumberOfPlayers < 2) // Potentially split up to new method?
                Game.State.GameStatus = GameStatus.AwaitingPlayers;

            await SendGameState();
            await SendLobbyPlayers();
            await UpdateGameToLobby();
        }
    }

    public async Task SubmitAnswer(Guid playerId, string answer)
    {
        var pl = new PlayerState();
        EnsureGameIsInProgress();
        if (IsCorrect(answer))
        {
            _ = Game.State.Scoreboard.AddOrUpdate(playerId, pl, (_, old) =>
            {
                old.Score += 1;
                return old;
            }); // [playerId]. Score++;
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
            await _worker.OnAllPlayersReady(Game.State.GameId, AllPlayersReady); // Allow creator to start game
    }

    public Task<QuizRuntime> GetRuntime()
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
        var info = new QuizRuntime
        {
            GameId = Game.State.GameId,
            Status = Game.State.GameStatus,
            NumberOfQuestions = Game.State.QuizSettings.Questions,
            Timeout = Game.State.Timeout,
            OwnerId = Game.State.OwnerId,
            Settings = Game.State.QuizSettings,
            CurrentQuestion = null,
            Scoreboard = users
        };

        return Task.FromResult(info);
    }

    public async Task StartGame(Guid playerId)
    {
        if (!AllPlayersReady && Game.State.OwnerId != playerId)
            throw new InvalidOperationException("Can't start game");
        if (!AllPlayersReady) throw new InvalidOperationException("All players not ready");
        Game.State.GameStatus = GameStatus.InProgress;
        Game.State.Questions = await _client.GetQuestions(Game.State.QuizSettings);
        Game.State.QuestionStep = 1;

        //await _worker.OnStatusUpdate(Game.State.GameId, Game.State.GameStatus);
        await SendGameState();
        await UpdateScoreboard();
        //await Task.Delay(2000);
        var q = Game.State.Questions[Game.State.QuestionStep]
            .ProcessQuestion(Game.State.QuestionStep);
        await _worker.OnNewQuestion(Game.State.GameId, q);
        //await UpdateGameToLobby();
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

    private async Task SendGameState()
    {
        var info = await GetRuntime();
        await _worker.OnUpdateGame(Game.State.GameId, info);
    }

    private async Task EndGame()
    {
        Game.State.GameStatus = GameStatus.Finished;
        await SendGameState();
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

    public Task<QuizResults> GetResults()
    {
        var scoreboard = Game.State.Scoreboard.Values.ToList();
        var playeresults = scoreboard.Select(player => new PlayerResult
            { Id = player.Id, Name = player.Name, Score = player.Score }).OrderByDescending(v => v.Score).ToList();

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
            await UpdateScoreboard();
            await Task.Delay(5000);
            await _worker.OnFinishQuestion(Game.State.GameId);
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