using System.Collections.Concurrent;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;

namespace API.Features.Lobby;

[Reentrant]
public class LobbyGrain : Grain, ILobbyGrain
{
    private readonly ConcurrentDictionary<Guid, GameLobbySummary> _cache = new();
    private readonly IHubContext<Hub> _hubContext;

    public LobbyGrain(IHubContext<Hub> hubContext)
    {
        _hubContext = hubContext;
    }
    
    public async Task RemoveGame(Guid gameId)
    {
        try
        {
            _cache.TryRemove(gameId, out var remove);
            await _hubContext.Clients.All.SendAsync(nameof(LobbyEvents.RemoveGame), gameId);
        }
        catch (Exception e)
        {
            //Console.WriteLine(e);
            throw;
        }
    }

    public async Task AddOrUpdateGame(Guid gameId, GameLobbySummary summary)
    {
        if (_cache.TryGetValue(gameId, out GameLobbySummary retrieved))
        {
            if (!_cache.TryUpdate(gameId, summary, retrieved))
            {
                throw new ArgumentException("Game could not be updates");
            }
            await _hubContext.Clients.All.SendAsync(nameof(LobbyEvents.EditGame), summary);
        }
        else
        {
            _cache.TryAdd(gameId, summary);
            await _hubContext.Clients.All.SendAsync(nameof(LobbyEvents.AddGame), summary);
        }
    }

    public Task<GameLobbySummary[]> GetGames() =>
        Task.FromResult(_cache.Values.ToArray());
}