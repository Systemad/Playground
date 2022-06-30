using Orleans;

namespace API.Features.Player;

public interface IPlayerGrain : IGrainWithGuidKey
{
    Task LeaveGame(Guid gameId, GameOutcome outcome);
    Task SetUsername(string username);
    Task<string> GetUsername();
}