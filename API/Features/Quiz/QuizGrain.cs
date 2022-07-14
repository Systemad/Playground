using System.Collections.Concurrent;
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
    
    private ConcurrentDictionary<int, Root> _questions;
    private readonly IQuizClient _quizClient;
    private int _quizStep = 0;
    
    // TODO: Fix timer, and make timesUp false when running
    // Temp
    private ConcurrentDictionary<Guid, bool> _answeredStates;
    private bool timesUp;

    private IHubContext<GlobalHub> _hubContext;
    public QuizGrain(IQuizClient quizClient, IHubContext<GlobalHub> hubContext)
    {
        _quizClient = quizClient;
        _hubContext = hubContext;
    }
    
    public override Task OnActivateAsync()
    {
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

    public async Task SubmitAnswer(MakeAnswer answer)
    {
        var question = _questions[answer.QuestionId];
        switch (answer.Answer)
        {
            case Answer.A:
                _answeredStates[answer.PlayerId] = bool.Parse(question.correct_answers.answer_a_correct);
                break;
            case Answer.B:
                _answeredStates[answer.PlayerId] = bool.Parse(question.correct_answers.answer_b_correct);
                break;
            case Answer.C:
                _answeredStates[answer.PlayerId] = bool.Parse(question.correct_answers.answer_c_correct);
                break;
            case Answer.D:
                _answeredStates[answer.PlayerId] = bool.Parse(question.correct_answers.answer_d_correct);
                break;
        }

        if (timesUp)
        {
            foreach (var (key, value) in _answeredStates)
            {
                if(value)
                    _playerScores.AddOrUpdate(key, 1, (_, count) => count + 1);
                
                await _hubContext.Clients.Client(key.ToString()).SendAsync("isCorrect", value);      
            }
        }
    }

    public Task<GameState> GetGameState()
    {
        return Task.FromResult(_gameState);
    }

    public Task<QuizSummary> GetSummary()
    {
        throw new NotImplementedException();
    }

    public Task SetGameName(string name)
    {
        _lobbyName = name;
        return Task.CompletedTask;
    }
    
    // TODO: Fix?? non async
    public async Task<GameState> StartGame(Guid playerId)
    {
        if (_gameState != GameState.Ready) throw new ArgumentException("Game is not ready");

        if (playerId != _ownerId) throw new ArgumentException("Not player id");
        
        _gameState = GameState.InProgress;
        _quizStep = 0;
        _questions = new ConcurrentDictionary<int, Root>(await _quizClient.GetQuizzes(_gamePreference));
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
}