using System.Collections.Concurrent;
using API.Features.Lobby;
using API.Features.Player;
using API.Features.Quiz.API;
using API.Features.Quiz.States;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private const int MaxCapacity = 4;
    
    private readonly IQuizClient _quizClient;

    private ConcurrentDictionary<Guid, bool> _answeredStates;
    
    private int _quizStep = 0;
    private Root _currentQuestion;

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
        [PersistentState("settings", "settingsStore")] IPersistentState<QuizState> quizState,
        IQuizClient quizClient,
        IHubContext<GlobalHub> hubContext)
    {
        _quizClient = quizClient;
        _hubContext = hubContext;
        _quizSettingsState = quizSettingsState;
        _quizState = quizState;
    }
    
    public override Task OnActivateAsync()
    {
        return base.OnActivateAsync();
    }
    
    public async Task CreateGame(Guid ownerId, string name)
    {
        _quizState.State.OwnerUserId = ownerId;
        _quizState.State.Name = name;
        _quizState.State.GameState = GameState.AwaitingPlayers;
        await _quizState.WriteStateAsync();
        await UpdateGameToLobby();
    }
    
    public async Task<GameState> AddPlayer(Guid playerId)
    {
        await CheckAndUpdateStatus();
        _quizState.State.PlayerScores.TryAdd(playerId, 0);
        await _quizState.WriteStateAsync();
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(QuizEvents.PlayerAdded));
        return _quizState.State.GameState;
    }
    
    public async Task<GameState> RemovePlayer(Guid playerId)
    {
        if (_quizState.State.GameState == GameState.AwaitingPlayers) return _quizState.State.GameState;
        try
        {
            _quizState.State.PlayerScores.TryRemove(playerId, out var removed);
            //await CheckAndUpdateStatus();
            await _quizState.WriteStateAsync();
            await UpdateGameToLobby();
            await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(QuizEvents.PlayerRemoved));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        return _quizState.State.GameState;
    }

    public async Task SubmitAnswer(Guid playerId, Answer answer)
    {
        if (_quizState.State.GameState == GameState.InProgress)
        {
            if (_answeredStates.TryGetValue(playerId, out bool hasAnswered))
                throw new ArgumentException("Question already answered");
        }

        //throw new ArgumentException("Game is over");
        
        if(IsCorrect(answer))
        {
            _quizState.State.PlayerScores.AddOrUpdate(playerId, 1, (_, count) => count + 1);
            _answeredStates[playerId] = true;
        }
        
        _answered++;
        if (_answeredStates.Values.Count == _quizState.State.PlayerScores.Keys.Count)
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
    
    public async Task<QuizRuntime> GetGameSummary()
    {
        var playerids = _quizState.State.PlayerScores.Keys;
        var active = _quizState.State.GameState == GameState.InProgress ? true : false;
        var players = new List<Player.Player>();
        await Parallel.ForEachAsync(playerids,
            async (id, _) =>
            {
                var player = GrainFactory.GetGrain<IPlayerGrain>(id);
                players.Add(await player.GetPlayerInfo());
            });
        var runtime = new QuizRuntime
        {
            GameActive = _quizState.State.GameState == GameState.InProgress,
            CurrentQuestion = _currentQuestion,
            Questions = _quizState.State.Questions.Count,
            QuestionStep = _quizStep,
            NumberOfPlayers = _quizState.State.PlayerScores.Keys.Count,
            Players = players
        };
        return runtime;
    }

    public async Task SetGameName(string name)
    {
        _quizState.State.Name = name;
        await _quizState.WriteStateAsync();
        await UpdateGameToLobby();
    }
    
    public async Task<GameState> StartGame(Guid playerId)
    {
        //await _quizSettingsState.ReadStateAsync();
        if (_quizState.State.GameState != GameState.Ready) throw new ArgumentException("Game is not ready");
        if (playerId != _quizState.State.OwnerUserId) throw new ArgumentException("Not player id");
        
        _quizState.State.Questions = await _quizClient.GetQuizzes(_quizSettingsState.State);
        _quizStep = 0;
        _answered = 0;
        _currentQuestion = _quizState.State.Questions[_quizStep];
        _quizState.State.GameState = GameState.InProgress;

        /*
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        await _quizSettingsState.WriteStateAsync();
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(QuizEvents.StartGame), true);
        await UpdateGameToLobby();
        return _quizState.State.GameState;
    }
    
    // For updating after creating game
    public async Task SetGameSettings(QuizSettingsModel quizPost)
    {
        _quizSettingsState.State.Category = quizPost.Category;
        _quizSettingsState.State.Difficulty = quizPost.Difficulty;
        await _quizSettingsState.WriteStateAsync();
        await UpdateGameToLobby();
    }

    private async Task CheckAndUpdateStatus()
    {
        var state = _quizState.State.GameState;
        if (state is GameState.Finished) throw new ApplicationException("Game finished");
        if (state is GameState.InProgress) throw new ApplicationException("Game is in progress");
        if (!(_quizState.State.PlayerScores.Keys.Count <= MaxCapacity)) throw new ArgumentException("Game is full");
        
        if (state is GameState.AwaitingPlayers && _quizState.State.PlayerScores.Keys.Count >= 2)
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
            Name = _quizState.State.Name,
            Mode = GameMode.Quiz,
            Players = _quizState.State.PlayerScores.Keys.Count,
            State = _quizState.State.GameState
        };
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddOrUpdateGame(gameSummary.Id, gameSummary);
    }

    private bool IsCorrect(Answer answer)
    {
        bool correct = false;
        switch (answer)
        {
            case Answer.A:
                correct = bool.Parse(_currentQuestion.correct_answers.answer_a_correct);
                break;
            case Answer.B:
                correct = bool.Parse(_currentQuestion.correct_answers.answer_b_correct);
                break;
            case Answer.C:
                correct = bool.Parse(_currentQuestion.correct_answers.answer_c_correct);
                break;
            case Answer.D:
                correct = bool.Parse(_currentQuestion.correct_answers.answer_d_correct);
                break;
        }
        return correct;
    }

    private async Task StopGame()
    {
        //_timer.Dispose();
        //_timerActive = false;
        _quizState.State.GameState = GameState.Finished;
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(QuizEvents.EndGame), true);
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
            _quizStep++;
            _currentQuestion = _quizState.State.Questions[_quizStep];
            /* Implement timer at later stage
            _timer = RegisterTimer(null,
                null,
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(1));
            */
        
            await _hubContext.Clients.Group(GrainKey.ToString())   // Countdown to next question - Next Question 
                .SendAsync(nameof(QuizEvents.NextQuestion), _currentQuestion);
        }
    }
}