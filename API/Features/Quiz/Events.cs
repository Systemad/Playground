using API.Features.Quiz.Models;

namespace API.Features.Quiz;

// TODO: https: //github.com/pmorelli92/Orleans.Tournament/blob/main/src/Domain/Tournaments/Events.cs#L5

internal interface IEvent
{
    Guid InvokerId { get; }
}
// InvokerId is either UserId if user action, or GameId if game action

public record TimerTicked(Guid GameId, int Timer);

public record PlayerAnswered(Guid GameId, Guid PlayerId);

public record GameStarted(Guid GameId, QuizRuntime Runtime);

public record GameEnded(Guid GameId);

public record GameReady(Guid GameId, QuizRuntime Runtime);

public record RoundEnded(Guid GameId, string CorrectAnswer, QuizRuntime Runtime);

public record RoundStarted(Guid GameId, QuizRuntime Runtime);

public record ScoreboardUpdated(Guid GameId, List<PlayerState> Scoreboard);

public record AllUsersReady(Guid GameId);