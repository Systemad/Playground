using API.Features.Quiz.Models;

namespace API.Features.Quiz;

// TODO: https: //github.com/pmorelli92/Orleans.Tournament/blob/main/src/Domain/Tournaments/Events.cs#L5

internal interface IEvent
{
    Guid InvokerId { get; }
}
// InvokerId is either UserId if user action, or GameId if game action

public record TimerTicked(int Timer, Guid InvokerId) : IEvent;

public record PlayerJoined(PlayerState Runtime, Guid InvokerId) : IEvent;

public record PlayerStatusChanged(bool Status, Guid InvokerId) : IEvent;

public record PlayerAnswered(Guid InvokerId) : IEvent;

public record GameStarted(QuizRuntime Runtime, Guid InvokerId) : IEvent;

public record GameEnded(Guid InvokerId) : IEvent;

public record GameReady(QuizRuntime Runtime, Guid InvokerId) : IEvent;

public record RoundEnded(string CorrectAnswer, QuizRuntime Runtime, Guid InvokerId) : IEvent;

public record RoundStarted(QuizRuntime Runtime, Guid InvokerId) : IEvent;

public record ScoreboardUpdated(List<PlayerState> Scoreboard, Guid InvokerId) : IEvent;