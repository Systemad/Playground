using Orleans;

namespace API.Features.Player;
// TODO:
/*
 * Add Persistence
 * Add ActiveGames,
 * --- Join through this, then this grain uses QuizGrain, and add gameid to active games,
 * --- in term of disconnect, automatically take this grain, and then use active grains to use GameGrain removeplayer
 */
public class PlayerGrain : Grain, IPlayerGrain
{
    private string _username = null!;
    private HashSet<Guid> _activeGame;
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
            Name = _username
        };

        return Task.FromResult(playerinfo);
    }

    public Task<string> GetUsername() => Task.FromResult(_username);
    
}