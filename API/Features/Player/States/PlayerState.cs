using System.Collections.Concurrent;
using API.Features.Quiz.API;

namespace API.Features.Player.States;

[Serializable]
public class PlayerState
{
    public string Name { get; set; }
    public HashSet<Guid> PastGames { get; set; }
    public int Experience { get; set; }
}