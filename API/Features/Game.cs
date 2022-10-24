using System.Runtime.Serialization;

namespace API.Features;

[Serializable]
public enum GameStatus
{

    AwaitingPlayers,

    //Ready,
    InProgress,

    Finished
    //Canceled
}

[Serializable]
public enum GameMode
{
    Quiz,
    TicTacToe,
    Guessing
}

[Serializable]
public class GameLobbySummary
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public GameMode Mode { get; set; }
    public int Players { get; set; }
    public GameStatus Status { get; set; }
    public string? Difficulty { get; set; }
}