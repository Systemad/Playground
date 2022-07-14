using Orleans;

namespace API.Features.Player;

//  TODO: Get avaivble games directly from LobbyGrain!!

public interface IPlayerGrain : IGrainWithGuidKey
{
    
    Task SetUsername(string username);
    Task<string> GetUsername();
}