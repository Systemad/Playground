namespace API.Features;

[Serializable]
public enum GameState
{
    AwaitingPlayer = 1,
    InProgress = 2,
    Finished = 3,
    Canceled = 4
}

[Serializable]
public enum GameOutcome
{
    Win = 1,
    Loss = 2,
    Draw = 3
}