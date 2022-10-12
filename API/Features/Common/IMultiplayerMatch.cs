namespace API.Features.Common;

public interface IMultiplayerMatch
{
    Task SubmitGuess(Guid playerId, string answer);
    Task SetStatus(Guid playerId, bool status);
    Task JoinGame(Guid playerId, string name);
    Task<bool> LeaveGame(Guid playerId);
}