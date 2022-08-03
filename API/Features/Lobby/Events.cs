namespace API.Features.Lobby;

//public record Event(Action ActionType, Guid? GameId);

public enum LobbyEvents
{
    AddGame,
    RemoveGame,
    EditGame
}