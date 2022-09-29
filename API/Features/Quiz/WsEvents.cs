namespace API.Features.Quiz;

public enum WsEvents
{
    PlayerAdded,
    PlayerRemoved,

    StartGame,
    StopGame,

    RoundResults,
    NextRound,


    UpdateScoreboard,

    PlayerAnswered,
    CorrectAnswer,

    AllUsersReady,
    ChangePlayerStatus,

    TimerTicked,

    RuntimeUpdated

}