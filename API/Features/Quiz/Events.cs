using API.Features.Quiz.Models;

namespace API.Features.Quiz;

// TODO: https: //github.com/pmorelli92/Orleans.Tournament/blob/main/src/Domain/Tournaments/Events.cs#L5

internal interface IEvent
{
    Guid InvokerId { get; }
}
// InvokerId is either UserId if user action, or GameId if game action

public record TimerTicked(Guid GameId, int Timer);

public record GameEnded(Guid GameId);

public record ScoreboardUpdated(Guid GameId, List<PlayerState> Scoreboard);

public record PlayerAnswered(Guid GameId, Guid PlayerId);

public record AllUsersReady(Guid GameId);

public record CorrectAnswer(Guid GameId, string Runtime);