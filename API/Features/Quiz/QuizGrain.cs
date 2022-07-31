using System.Collections.Concurrent;
using API.Features.Lobby;
using API.Features.Quiz.API;
using API.Features.Quiz.States;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz;

// TODO: Remove lots of private fields
// Switch to persistent state
// and use Class to store everything??
// Either way, private fields needs to clean up, 
// and clean up QuizSettings, SettingsModel, Summary etc
[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private const int MaxCapacity = 4;
    
    private readonly IQuizClient _quizClient;
    private int _quizStep = 0;
    
    private ConcurrentDictionary<Guid, bool> _answeredStates;
    private Root _currentQuestion;

    //private IDisposable _timer;
    private int _answered;
    private bool _timerActive;

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
        _answered = 0;
        _quizState.State.GameState = GameState.AwaitingPlayers;
        return base.OnActivateAsync();
    }
    
    public async Task CreateGame(Guid gameOwnerId, string name, QuizSettingsModel quizModel)
    {
        _quizState.State.OwnerUserId = gameOwnerId;
        _quizState.State.Name = name;
        // FIX
        _quizSettingsState.State = CreateGameSettings(gameOwnerId, quizModel);

        var gameSummary = new GameLobbySummary
        {
            Id = GrainKey,
            Name = _quizState.State.Name,
            Mode = GameMode.Quiz,
            Players = _quizState.State.PlayerScores.Count,
            State = _quizState.State.GameState
        };
        
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddGame(gameSummary);
    }

    // TODO: CHECK everything and use StateWriteAsync!!!
    public Task<GameState> AddPlayer(Guid playerId)
    {
        Task.Run(CheckAndUpdateStatus);
        if (!(_quizState.State.PlayerScores.Count <= MaxCapacity)) throw new ArgumentException("Game is full");
        _quizState.State.PlayerScores.TryAdd(playerId, 0);
        return Task.FromResult(_quizState.State.GameState);
    }
    
    public Task<GameState> RemovePlayer(Guid playerId)
    {
        Task.Run(CheckAndUpdateStatus);
        if (_quizState.State.GameState == GameState.AwaitingPlayers) return Task.FromResult(_quizState.State.GameState);
        try
        {
            _quizState.State.PlayerScores.TryRemove(playerId, out var removed); 
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        return Task.FromResult(_quizState.State.GameState);
    }

    public Task CreateGame(Guid gameOwner, string name)
    {
        throw new NotImplementedException();
    }

    public async Task SubmitAnswer(Guid playerId, Answer answer)
    {
        
        if (!_timerActive || _quizState.State.GameState != GameState.InProgress) throw new ArgumentException("Game is over");
        
        if (_answeredStates.TryGetValue(playerId, out bool hasAnswered))
            throw new ArgumentException("Question already answered");
        
    
        if(IsCorrect(answer))
        {
            _quizState.State.PlayerScores.AddOrUpdate(playerId, 1, (_, count) => count + 1);
            _answeredStates[playerId] = true;
        }
        
        _answered++;
        if (_answered == _quizState.State.PlayerScores.Count)
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
            State = _quizSettingsState.State.State,
            Category = _quizSettingsState.State.Category,
            Questions = _quizState.State.Questions.Count,
        };
        return Task.FromResult(gameSettings);
    }

    // This is the game info you see while in the game, and it updates frequently after evey qustion etc
    public Task<QuizRuntime> GetGameSummary()
    {
        throw new NotImplementedException();
    }

    public async Task SetGameName(string name)
    {
        _quizState.State.Name = name;
        await _quizState.WriteStateAsync();
    }
    
    public async Task<GameState> StartGame(Guid playerId)
    {
        await _quizSettingsState.ReadStateAsync();
        if (_quizState.State.GameState != GameState.Ready) throw new ArgumentException("Game is not ready");
        if (playerId != _quizState.State.OwnerUserId) throw new ArgumentException("Not player id");
        
        // FIX
        _questions = await _quizClient.GetQuizzes(_gameSettings);
        _currentQuestion = _quizState.State.Questions[0];
        _quizState.State.GameState = GameState.InProgress;
        _quizStep = 0;

        /*
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        await _quizSettingsState.WriteStateAsync();
        return _quizState.State.GameState;
    }
    
    // For updating after creating game
    public Task SetGameSettings(QuizSettingsModel quizPost)
    {
        _quizSettingsState.State.Category = quizPost.Category;
        _quizSettingsState.State.Difficulty = quizPost.Difficulty;
        return Task.CompletedTask;
    }

    private Task CheckAndUpdateStatus()
    {
        var state = _quizState.State.GameState;
        if (state is GameState.Finished) throw new ApplicationException("Game finished");
        if (state is GameState.InProgress) throw new ApplicationException("Game is in progress");

        if (state is GameState.AwaitingPlayers && _quizState.State.PlayerScores.Count >= 2)
        {
            state = GameState.Ready;
        }
        return Task.CompletedTask;
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
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync("gameOver", true);
    }
    
    private async Task NextQuestion()
    {
        //_timer.Dispose();
        //_timerActive = false;

        if (_quizStep == _quizState.State.Questions.Count)
            await StopGame();

        _quizStep++;
        _currentQuestion = _quizState.State.Questions[_quizStep];
        /* Implement timer at later stage
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync("startNextRound", true);
    }
}