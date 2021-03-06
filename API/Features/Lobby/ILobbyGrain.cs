using Orleans;
using Orleans.Concurrency;

namespace API.Features.Lobby;

public interface ILobbyGrain : IGrainWithIntegerKey
{
    Task AddGame(GameSummary summary);
    Task RemoveGame(Guid gameId);

    Task<Game[]> GetGames();
}

[Immutable]
[Serializable]
public class Game
{
    public Guid GameId { get; set; }
    public string? Name { get; set; }
    public GameMode Mode { get; set; }
}