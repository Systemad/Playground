using Orleans;

namespace API.Features.Player;

public interface IPlayerGrain : IGrainWithGuidKey
{
    Task SetUsername(string username);
    Task<Player> GetPlayerInfo();
    Task<string> GetUsername();
    Task<Guid> GetActiveGame();
    Task SetConnectionId(string connectionId);
    Task ResetConnectionId();
    Task<string> GetConnectionId();
    Task SetActiveGame(Guid gameId);
    Task RemoveActiveGame();
}