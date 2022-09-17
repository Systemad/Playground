namespace API.Features.Quiz;

public enum Events
{
    PlayerAdded,
    PlayerRemoved,

    StartGame,
    StopGame,

    RoundResults,
    NextRound,

    PlayerStatusChange,
    UpdateScoreboard,

    PlayerAnswered,
    CorrectAnswer

}