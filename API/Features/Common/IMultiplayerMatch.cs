namespace API.Features.Common;

public interface IMultiplayerMatch
{
    Task SetStatus(Guid playerId, bool status);
    Task JoinGame(Guid playerId, string name);
    Task<bool> LeaveGame(Guid playerId);
}