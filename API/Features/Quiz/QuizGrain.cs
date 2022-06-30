using API.Features.Quiz.QuizApi;
using Orleans;
using Orleans.Concurrency;

namespace API.Features.Quiz;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private List<Guid> _playersIds = new();
    private GameState _gameState;
    private Guid _winnerId;

    // Temporary answer state, resets after every question 
    private Dictionary<Guid, AnsweredState> _answeredState;
    private int _qustionStep;
    private Root[] _questions;
    public override Task OnActivateAsync()
    {
        _answeredState = new Dictionary<Guid, AnsweredState>();
        _qustionStep = 0;
        _playersIds = new List<Guid>();
        _gameState = GameState.AwaitingPlayer;
        _winnerId = Guid.Empty;
        return base.OnActivateAsync();
    }

    public Task<GameState> AddPlayer(Guid playerId)
    {
        throw new NotImplementedException();
    }

    public Task<AnswerResult> SetAnswer(Answer answer)
    {
        throw new NotImplementedException();
    }

    public Task<GameState> GetGameState()
    {
        throw new NotImplementedException();
    }

    public Task<QuizSummary> GetSummary()
    {
        throw new NotImplementedException();
    }

    public Task SetLobbyName(string name)
    {
        throw new NotImplementedException();
    }
}