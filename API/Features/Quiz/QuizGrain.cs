using System.Collections.Concurrent;
using System.Diagnostics;
using API.Features.Lobby;
using API.Features.Quiz.API;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;

namespace API.Features.Quiz;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private const int MaxCapacity = 4;
    private HashSet<Guid> _playersIds = new();
    private ConcurrentDictionary<Guid, int> _playerScores = new();

    private GameState _gameState;
    private Guid _ownerId;
    private string _lobbyName = null!;
    private QuizPost _gamePreference;

    private Root[] _questions;
    private readonly IQuizClient _quizClient;
    private int _quizStep = 0;
    

    private ConcurrentDictionary<Guid, bool> _answeredStates;
    private Root _currentQuestion;

    //private IDisposable _timer;
    private int _answered;
    private bool _timerActive;

    private readonly IHubContext<GlobalHub> _hubContext;
    public QuizGrain(IQuizClient quizClient, IHubContext<GlobalHub> hubContext)
    {
        _quizClient = quizClient;
        _hubContext = hubContext;
    }
    
    public override Task OnActivateAsync()
    {
        _answered = 0;
        _playersIds = new HashSet<Guid>();
        _gameState = GameState.AwaitingPlayers;
        return base.OnActivateAsync();
    }
    
    public async Task CreateGame(Guid gameOwnerId, string name)
    {
        _ownerId = gameOwnerId;
        _lobbyName = name;
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddGame(this.GetPrimaryKey(), name);
    }

    public Task<GameState> AddPlayer(Guid playerId)
    {
        Task.Run(CheckAndUpdateStatus);
        if (!(_playersIds.Count <= MaxCapacity)) throw new ArgumentException("Game is full");
        _playersIds.Add(playerId);
        return Task.FromResult(_gameState);
    }
    
    public Task<GameState> RemovePlayer(Guid playerId)
    {
        Task.Run(CheckAndUpdateStatus);
        
        if(_gameState != GameState.AwaitingPlayers)
            _playersIds.Remove(playerId);
        
        return Task.FromResult(_gameState);
    }

    public async Task SubmitAnswer(Guid playerId, Answer answer)
    {
        
        if (!_timerActive || _gameState != GameState.InProgress) throw new ArgumentException("Game is over");
        
        if (_answeredStates.TryGetValue(playerId, out bool hasAnswered))
            throw new ArgumentException("Question already answered");
        
    
        if(IsCorrect(answer))
        {
            _playerScores.AddOrUpdate(playerId, 1, (_, count) => count + 1);
            _answeredStates[playerId] = true;
        }
        
        _answered++;
        if (_answered == _playersIds.Count)
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

    public Task<GameState> GetGameState() => Task.FromResult(_gameState);

    public Task<QuizSummary> GetSummary()
    {
        throw new NotImplementedException();
    }

    public Task SetGameName(string name)
    {
        _lobbyName = name;
        return Task.CompletedTask;
    }
    
    public async Task<GameState> StartGame(Guid playerId)
    {
        if (_gameState != GameState.Ready) throw new ArgumentException("Game is not ready");
        if (playerId != _ownerId) throw new ArgumentException("Not player id");
        _questions = await _quizClient.GetQuizzes(_gamePreference);
        _currentQuestion = _questions[0];
        _gameState = GameState.InProgress;
        _quizStep = 0;

        /*
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        
        return _gameState;
    }
    
    public Task SetGamePreference(QuizPost quizPost)
    {
        _gamePreference = quizPost;
        return Task.CompletedTask;
    }

    private Task CheckAndUpdateStatus()
    {
        if (_gameState is GameState.Finished) throw new ApplicationException("Game finished");
        if (_gameState is GameState.InProgress) throw new ApplicationException("Game is in progress");

        if (_gameState is GameState.AwaitingPlayers && _playersIds.Count >= 2)
        {
            _gameState = GameState.Ready;
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
        _gameState = GameState.Finished;
        await _hubContext.Clients.Group(this.GetPrimaryKey().ToString()).SendAsync("gameOver", true);
    }
    
    private async Task NextQuestion()
    {
        //_timer.Dispose();
        //_timerActive = false;

        if (_quizStep == _questions.Length)
            await StopGame();

        _quizStep++;
        _currentQuestion = _questions[_quizStep];
        /* Implement timer at later stage
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        await _hubContext.Clients.Group(this.GetPrimaryKey().ToString()).SendAsync("startNextRound", true);
    }
}