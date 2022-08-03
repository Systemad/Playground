using Orleans;

namespace API.Features;

public interface IMultiplayerGrain : IGrainWithGuidKey
{
    Task<GameState> AddPlayer(Guid playerId);
    Task<GameState> RemovePlayer(Guid playerId);   
    Task CreateGame(Guid ownerId, string name);
    Task SetGameName(string name);
    Task<GameState> GetGameState();
    Task<GameState> StartGame(Guid playerId);
}