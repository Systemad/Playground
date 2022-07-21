using API.Features.Quiz.API;
using Orleans;

namespace API.Features.Quiz;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(Guid playerId, Answer answer);
    Task SetGamePreference(QuizPost quizPost);
    Task<QuizSummary> GetSummary();
}