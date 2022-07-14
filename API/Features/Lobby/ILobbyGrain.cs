using Orleans;
using Orleans.Concurrency;

namespace API.Features.Lobby;

public interface ILobbyGrain : IGrainWithIntegerKey
{
    Task AddGame(Guid gameId, string name);
    Task RemoveGame(Guid gameId);

    Task<Game[]> GetGames();
}

[Immutable]
[Serializable]
public class Game
{
    public Guid GameId { get; set; }
    public string? GameName { get; set; }
    //public GameType GameType { get; set; }
}