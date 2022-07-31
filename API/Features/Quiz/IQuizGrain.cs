using API.Features.Quiz.API;
using Orleans;

namespace API.Features.Quiz;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(Guid playerId, Answer answer);
    Task SetGameSettings(QuizSettingsModel quizPost);
    Task<QuizSettings> GetGameSettings();
    Task<QuizRuntime> GetGameSummary();
}