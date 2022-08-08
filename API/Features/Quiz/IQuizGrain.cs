using API.Features.Quiz.API;

namespace API.Features.Quiz;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(Guid playerId, string answer);
    Task SetGameSettings(QuizSettingsModel quizPost);
    Task<QuizSettingState> GetGameSettings();
    Task<QuizRuntime> GetGameSummary();
    Task<Dictionary<Guid, PlayerRuntime>> GetGameScoreboard();
}