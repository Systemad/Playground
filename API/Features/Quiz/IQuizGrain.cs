using API.Features.Quiz.API;
using Orleans;

namespace API.Features.Quiz;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(MakeAnswer answer);
    Task SetGamePreference(QuizPost quizPost);
    Task<QuizSummary> GetSummary();
}