using API.Features.Quiz.API;
using Orleans;

namespace API.Features;

public interface IMultiplayerGrain : IGrainWithGuidKey
{
    Task<GameState> AddPlayer(Guid playerId);
    Task<GameState> RemovePlayer(Guid playerId);
    Task<GameState> GetGameState();
    Task<GameState> StartGame(Guid playerId);
}