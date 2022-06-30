using API.Features.Quiz.QuizApi;
using Orleans;

namespace API.Features.Quiz;

public interface IQuizGrain : IGrainWithGuidKey
{
    Task<GameState> AddPlayer(Guid playerId);
    Task<AnswerResult> SetAnswer(Answer answer);
    Task<GameState> GetGameState();
    Task<QuizSummary> GetSummary();
    Task SetLobbyName(string name);
}