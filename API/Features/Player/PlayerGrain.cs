using Orleans;

namespace API.Features.Player;

public class PlayerGrain : Grain, IPlayerGrain
{
    private string _username = null!;
    private static string GrainType => nameof(PlayerGrain);
    private Guid GrainKey => this.GetPrimaryKey();
    
    public Task SetUsername(string username)
    {
        _username = username;
        return Task.CompletedTask;
    }

    public Task<Player> GetPlayerInfo()
    {
        var playerinfo = new Player
        {
            Id = GrainKey,
            Username = _username
        };

        return Task.FromResult(playerinfo);
    }

    public Task<string> GetUsername() => Task.FromResult(_username);
    
}