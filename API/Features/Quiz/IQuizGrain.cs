using API.Features.Quiz.API;
using API.Features.Quiz.States;
using Orleans;

namespace API.Features.Quiz;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(Guid playerId, Answer answer);
    Task SetGameSettings(QuizSettingsModel quizPost);
    Task<QuizSettingState> GetGameSettings();
    Task<QuizRuntime> GetGameSummary();
}