namespace API.Features.SignalR;

//public record Event(Action ActionType, Guid? GameId);

public enum Action
{
    AddGame,
    RemoveGame,
    EditGame
}

public static class Constants
{
    public const string AddGame = "AddGame";
}