using API.Features.Quiz.Models;
using Orleans;

namespace API.Features.Quiz.Interfaces;

public interface IQuizPushWorker : IGrainWithIntegerKey
{
    Task OnTimerTicked(Guid gameId, int timer);
    Task OnUpdateGame(Guid gameId, QuizRuntime runtime);
    Task OnLobbyUpdated(Guid gameId, List<LobbyPlayer> players);
    Task OnStatusUpdate(Guid gameId, GameStatus status);
    Task OnNewQuestion(Guid gameId, ProcessedQuestion question);
    Task OnFinishQuestion(Guid gameId);
    Task OnCorrectAnswer(Guid gameId, string question);
    Task OnAllPlayersReady(Guid gameId, bool status);
    Task OnScoreboardUpdate(Guid gameId, List<PlayerStateDto> scoreboard);
}