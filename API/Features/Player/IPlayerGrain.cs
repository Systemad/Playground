using Orleans;

namespace API.Features.Player;

public interface IPlayerGrain : IGrainWithGuidKey
{
    Task SetUsername(string username);
    Task<string> GetUsername();
}