namespace API.Features;

[Serializable]
public enum GameState
{
    AwaitingPlayers,
    Ready,
    InProgress,
    Finished,
    Canceled,
}

[Serializable]
public enum GameOutcome
{
    Win,
    Loss,
    Draw
}

[Serializable]
public enum GameMode
{
    Quiz,
    TicTacToe
}