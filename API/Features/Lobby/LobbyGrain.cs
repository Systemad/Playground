using System.Collections.Concurrent;
using System.Runtime.Caching;
using Orleans;
using Orleans.Concurrency;

namespace API.Features.Lobby;

[Reentrant]
public class LobbyGrain : Grain, ILobbyGrain
{
    private readonly ConcurrentDictionary<Guid, GameSummary> _cache = new();

    
    public Task AddGame(GameSummary summary)
    {
        _cache.TryAdd(summary.Id, summary);
        return Task.CompletedTask;
    }

    public Task RemoveGame(Guid gameId)
    {
        _cache.TryRemove(gameId, out var remove);
        return Task.CompletedTask;
    }

    public Task<Game[]> GetGames() =>
        Task.FromResult(_cache.Select(x => new Game { GameId = Guid.Parse(x.Key), Name = x.Value as string })
            .ToArray());
}