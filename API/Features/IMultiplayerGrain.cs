using API.Features.Common;
using API.Features.Quiz.API;
using Orleans;

namespace API.Features;

public interface IMultiplayerGrain : IGrainWithGuidKey
{
    Task AddPlayer(Guid playerId);
    Task RemovePlayer(Guid playerId);
    Task StartGame(Guid playerId);
    Task SetPlayerStatus(Guid playerId, bool status);
}