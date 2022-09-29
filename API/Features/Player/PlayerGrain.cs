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
    private string _connectionId;
    private Guid _activeGame = Guid.Empty!;
    private static string GrainType => nameof(PlayerGrain);
    private Guid GrainKey => this.GetPrimaryKey();

    public Task SetUsername(string username)
    {
        _username = username;
        var hey = _username;
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

    public Task<string> GetUsername()
    {
        return Task.FromResult(_username);
    }

    public Task<Guid> GetActiveGame()
    {
        return Task.FromResult(_activeGame);
    }

    public Task SetConnectionId(string connectionId)
    {
        _connectionId = connectionId;
        return Task.CompletedTask;
    }

    public Task ResetConnectionId()
    {
        _connectionId = string.Empty;
        return Task.CompletedTask;
    }

    public Task<string> GetConnectionId()
    {
        return Task.FromResult(_connectionId);
    }

    public Task SetActiveGame(Guid gameId)
    {
        _activeGame = gameId;
        return Task.CompletedTask;
    }

    public Task RemoveActiveGame()
    {
        _activeGame = Guid.Empty;
        return Task.CompletedTask;
    }
}