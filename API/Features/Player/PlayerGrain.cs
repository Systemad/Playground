using Orleans;

namespace API.Features.Player;

public class PlayerGrain : Grain, IPlayerGrain
{
    

    public Task SetUsername(string username)
    {
        throw new NotImplementedException();
    }

    public Task<string> GetUsername()
    {
        throw new NotImplementedException();
    }
}