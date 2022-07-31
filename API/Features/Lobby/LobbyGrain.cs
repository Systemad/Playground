using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;
using Action = API.Features.SignalR.Action;

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

    public async Task AddGame(GameLobbySummary summary)
    {
        try
        {
            _cache.TryAdd(summary.Id, summary);
            await _hubContext.Clients.All.SendAsync(nameof(Action.AddGame), summary);
        }
        catch (Exception e)
        {
            //Console.WriteLine(e);
            throw;
        }
    }

    public async Task RemoveGame(Guid gameId)
    {
        try
        {
            _cache.TryRemove(gameId, out var remove);
            await _hubContext.Clients.All.SendAsync(nameof(Action.RemoveGame), gameId);
        }
        catch (Exception e)
        {
            //Console.WriteLine(e);
            throw;
        }
    }

    public Task<GameLobbySummary[]> GetGames() =>
        Task.FromResult(_cache.Values.ToArray());
}