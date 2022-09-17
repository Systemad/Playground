namespace API.Features;

[Serializable]
public enum GameState
{
    AwaitingPlayers,
    Ready,
    InProgress,
    Finished,
    Canceled
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
    TicTacToe,
    Guessing
}

[Serializable]
public struct GameLobbySummary
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public GameMode Mode { get; set; }
    public int Players { get; set; }
    public GameState State { get; set; }
    public string? Difficulty { get; set; }
}