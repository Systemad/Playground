namespace API.Features.Common;

public interface IMultiplayerMatch
{
    Task SubmitGuess(Guid userId, string answer);
    Task SetStatus(Guid userId, bool status);
    Task JoinGame(Guid userId, string name);
    Task LeaveGame(Guid userId);
}