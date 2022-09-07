namespace API.Features.Quiz.Models;

public class Scoreboard
{
    public Guid GameId { get; set; }
    public List <PlayerRuntime> Players { get; set; }
}