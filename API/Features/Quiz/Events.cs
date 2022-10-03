using API.Features.Quiz.Models;

namespace API.Features.Quiz;

// TODO: https: //github.com/pmorelli92/Orleans.Tournament/blob/main/src/Domain/Tournaments/Events.cs#L5

internal interface IEvent
{
    Guid InvokerId { get; }
}

public record TimerTicked(Guid GameId, int Timer);

public record GameEnded(Guid GameId);

public record GameStarted(Guid GameId);

public record ScoreboardUpdated(Guid GameId, List<PlayerState> Scoreboard);

public record AllUsersReady(Guid GameId, bool Status);

public record CorrectAnswer(Guid GameId, string Question);

public record NewQuestion(Guid GameId, ProcessedQuestion Question);

public record FinishQuestion(Guid GameId);

public record QuizInfo(Guid GameId, QuizRuntime Runtime);