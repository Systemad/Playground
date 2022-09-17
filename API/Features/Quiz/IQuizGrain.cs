using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Models;
using Orleans;

namespace API.Features.Quiz;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(Guid playerId, string answer);
    Task SetGameSettings(QuizCreationModel quizPost);
    Task CreateGame(Guid ownerId, QuizCreationModel settings);
    Task<Runtime> GetGameRuntime();
    Task<Scoreboard> GetGameScoreboard();
    Task<GameResult> GetQuizResults();
}