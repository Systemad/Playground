using System.Runtime.Caching;
using Orleans;
using Orleans.Concurrency;

namespace API.Features.Lobby;

[Reentrant]
public class LobbyGrain : Grain, ILobbyGrain
{
    private readonly MemoryCache _cache = new ("lobby");
    public Task AddGame(Guid gameId, string name)
    {
        _cache.Add(gameId.ToString(), name, new DateTimeOffset(DateTime.UtcNow).AddHours(1));
        return Task.CompletedTask;
    }

    public Task RemoveGame(Guid gameId)
    {
        _cache.Remove(gameId.ToString());
        return Task.CompletedTask;
    }

    public Task<Game[]> GetGames() =>
        Task.FromResult(_cache.Select(x => new Game { GameId = Guid.Parse(x.Key), GameName = x.Value as string })
            .ToArray());
}