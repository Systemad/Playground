namespace API.Features.Quiz;

public enum Events
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
    ChangePlayerStatus

}