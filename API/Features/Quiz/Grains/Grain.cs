using System.Collections.Concurrent;
using API.Features.Lobby;
using API.Features.Player;
using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Models;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz.Grains;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private const int MaxCapacity = 4;
    
    private readonly IOpenTdbClient _client;

    private ConcurrentDictionary<Guid, bool> _answeredStates;
    private List<PlayerRuntime> PlayerRuntimes;

    private ConcurrentDictionary<IPlayerGrain, int> _score;
    private int _quizStep = 0;
    private Result _currentQuestion;

    //private IDisposable _timer;
    private int _answered;
    //private bool _timerActive;
    
    private readonly IPersistentState<QuizState> _quizState;
    private readonly IPersistentState<QuizSettingState> _quizSettingsState;

    private static string GrainType => nameof(QuizGrain);
    private Guid GrainKey => this.GetPrimaryKey();
    private readonly IHubContext<GlobalHub> _hubContext;
    public QuizGrain(
        [PersistentState("quiz", "quizStore")] IPersistentState<QuizSettingState> quizSettingsState,
        [PersistentState("settings", "settingStore")] IPersistentState<QuizState> quizState,
        IHubContext<GlobalHub> hubContext, IOpenTdbClient client)
    {
        _hubContext = hubContext;
        _client = client;
        _quizSettingsState = quizSettingsState;
        _quizState = quizState;
    }
    
    public override async Task OnActivateAsync()
    {
        await base.OnActivateAsync();
    }
    
    public async Task CreateGame(Guid ownerId, QuizCreationModel settings)
    {
        var news = QuizCreationMapper.ToSettingsState(settings);
        _quizSettingsState.State = news;
        _quizSettingsState.State.OwnerUserId = ownerId;
        _quizState.State.GameState = GameState.AwaitingPlayers;
        await _quizState.WriteStateAsync();
        await UpdateGameToLobby();
    }

    public async Task<GameState> AddPlayer(Guid playerId)
    {
        //await CheckAndUpdateStatus();
        await PreparePlayer(playerId);
        await _quizState.WriteStateAsync();
        var player = GrainFactory.GetGrain<IPlayerGrain>(playerId);
        var pinfo = await player.GetPlayerInfo();
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.PlayerAdded), pinfo);
        return _quizState.State.GameState;
    }
    
    public async Task<GameState> RemovePlayer(Guid playerId)
    {
        if (_quizState.State.GameState == GameState.AwaitingPlayers) return _quizState.State.GameState;
        try
        {
            _quizState.State.Players.Remove(playerId);
            //await CheckAndUpdateStatus();
            await _quizState.WriteStateAsync();
            await UpdateGameToLobby();
            await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.PlayerRemoved), playerId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        return _quizState.State.GameState;
    }

    public async Task SubmitAnswer(Guid playerId, string answer)
    {
        if (_quizState.State.GameState == GameState.InProgress)
        {
            if (_answeredStates.TryGetValue(playerId, out bool hasAnswered))
                throw new ArgumentException("Question already answered");
        }

        //throw new ArgumentException("Game is over");
        
        if(IsCorrect(answer))
        {
            _quizState.State.Scoreboard[playerId].Score++; // .u  AddOrUpdate(playerId, 1, (_, count) => ++count );
            _answeredStates[playerId] = true;
        }

        _quizState.State.Scoreboard[playerId].Answered = true;
        
        // remove?? just use above??
        _answered++;
        // Send value!
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync("UpdateScore", _quizState.State.Scoreboard[playerId]);
        
        if (_answeredStates.Values.Count == _quizState.State.Scoreboard.Keys.Count)
        {
            await NextQuestion();
        }

        /*
         Do this after rounds ends and before nest starts
        if (_gameActive && IsCorrect(answer))
        {
            foreach (var (key, value) in _answeredStates)
            {
                send with signalr true of false, wether is was correct
            }
        }
        */

    }

    public Task<GameState> GetGameState() => Task.FromResult(_quizState.State.GameState);

    // Fix?? Split to new class??
    public Task<QuizSettingState> GetGameSettings()
    {
        var gameSettings = new QuizSettingState
        {
            Difficulty = _quizSettingsState.State.Difficulty,
            Category = _quizSettingsState.State.Category,
            Questions = _quizState.State.Questions.Count,
        };
        return Task.FromResult(gameSettings);
    }
    
    public async Task<Runtime> GetGameSummary()
    {
        var playerids = _quizState.State.Scoreboard.Keys;
        var players = new List<Player.Player>();
        await Parallel.ForEachAsync(playerids,
            async (id, _) =>
            {
                var player = GrainFactory.GetGrain<IPlayerGrain>(id);
                players.Add(await player.GetPlayerInfo());
            });
        var runtime = new Runtime
        {
            GameActive = _quizState.State.GameState == GameState.InProgress,
            CurrentQuestion = _currentQuestion,
            Questions = _quizState.State.Questions.Count,
            QuestionStep = _quizStep,
            NumberOfPlayers = _quizState.State.Scoreboard.Keys.Count,
            Players = players
        };
        return runtime;
    }
    
    public Task<Scoreboard> GetGameScoreboard()
    {
        var board = new Scoreboard
        {
            GameId = GrainKey,
            Players = _quizState.State.Scoreboard.Values.ToList()
        };
        return Task.FromResult(board);
    }

    public Task<GameResult> GetQuizResults()
    {
        var state = _quizState.State;
        var settings = _quizSettingsState.State;
        
        // TODO: Urgent Fix Dictiornary
        var results = new GameResult();

        return Task.FromResult(results);
    }

    public async Task SetPlayerStatus(Guid playerId, bool status)
    {
        var player = _quizState.State.Scoreboard.FirstOrDefault(x => x.Key == playerId);
        player.Value.Ready = status;
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.PlayerStatusChange), playerId, status);
        
        // Check rdy status
        // Find better method, works for now?
        int rdy = 0;
        foreach (var (key, value) in _quizState.State.Scoreboard)
        {
            if (value.Ready) rdy++;
        }

        if (rdy == _quizState.State.Scoreboard.Count)
            _quizState.State.GameState = GameState.Ready;
    }

    public async Task<GameState> StartGame(Guid playerId)
    {
        //await _quizSettingsState.ReadStateAsync();
        if (_quizState.State.GameState != GameState.Ready) throw new ArgumentException("Game is not ready");
        if (playerId != _quizSettingsState.State.OwnerUserId) throw new ArgumentException("Not player id");
        
        _quizState.State.Questions = await _client.GetQuestions(_quizSettingsState.State);
        _quizStep = 0;
        _answered = 0;
        _currentQuestion = _quizState.State.Questions[_quizStep];
        _currentQuestion.incorrect_answers.Add(_currentQuestion.correct_answer);
        _quizState.State.GameState = GameState.InProgress;

        /*
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        await _quizSettingsState.WriteStateAsync();
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.StartGame), true);
        await UpdateGameToLobby();
        return _quizState.State.GameState;
    }
    
    public async Task SetGameSettings(QuizCreationModel quizPost)
    {
        var news = QuizCreationMapper.ToSettingsState(quizPost);
        _quizSettingsState.State = news;
        await _quizSettingsState.WriteStateAsync();
        await UpdateGameToLobby();
    }

    private async Task CheckAndUpdateStatus()
    {
        var state = _quizState.State.GameState;
        if (state is GameState.Finished) throw new ApplicationException("Game finished");
        if (state is GameState.InProgress) throw new ApplicationException("Game is in progress");
        if (!(_quizState.State.Scoreboard.Keys.Count <= MaxCapacity)) throw new ArgumentException("Game is full");
        
        if (state is GameState.AwaitingPlayers && _quizState.State.Scoreboard.Keys.Count >= 2)
        {
            _quizState.State.GameState = GameState.Ready;
            await _quizState.WriteStateAsync();
            await UpdateGameToLobby();
        }
    }
    
    private async Task UpdateGameToLobby()
    {
        var gameSummary = new GameLobbySummary
        {
            Id = GrainKey,
            Name = _quizSettingsState.State.Name,
            Mode = GameMode.Quiz,
            Players = _quizState.State.Scoreboard.Keys.Count,
            State = _quizState.State.GameState
        };
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddOrUpdateGame(gameSummary.Id, gameSummary);
    }

    private bool IsCorrect(string answer) => answer == _currentQuestion.correct_answer;

    private async Task StopGame()
    {
        //_timer.Dispose();
        //_timerActive = false;
        _quizState.State.GameState = GameState.Finished;
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.EndGame), true);
    }

    private async Task PreparePlayer(Guid id)
    {
        var player = GrainFactory.GetGrain<IPlayerGrain>(id);
        var score = new PlayerRuntime
        {
            Id = id,
            Name = await player.GetUsername(),
            Score = 0,
            Answered = false
        };
        _quizState.State.Scoreboard[id] = score;
        await _quizState.WriteStateAsync();
    }
    
    private async Task NextQuestion()
    {
        //_timer.Dispose();
        //_timerActive = false;

        if (_quizStep == _quizState.State.Questions.Count && _quizState.State.GameState == GameState.InProgress)
        {
            await StopGame();   
        }
        else
        {

            /* Implement timer at later stage
            _timer = RegisterTimer(null,
                null,
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(1));
            */
            foreach (var player in _answeredStates)
            {
                await _hubContext.Clients.User(player.Key.ToString())
                    .SendAsync(nameof(Events.RoundResults), _currentQuestion.correct_answer);
            }

            foreach (var (key, value) in _quizState.State.Scoreboard)
            {
                _quizState.State.Scoreboard[key].Answered = false;   
            }

            _answeredStates.Clear();
            _quizStep++;
            _currentQuestion = _quizState.State.Questions[_quizStep];
            
            await Task.Delay(5000);
            _currentQuestion.incorrect_answers.Add(_currentQuestion.correct_answer);
            await _hubContext.Clients.Group(GrainKey.ToString())
                .SendAsync(nameof(Events.NextQuestion), _currentQuestion);
        }
    }
}