namespace API.Features.Quiz.Models;

public class GameResult
{
    public Guid GameId { get; set; }
    public string Name { get; set; }
    public List<PlayerRuntime> Scoreboard { get; set; }
    public string Category { get; set; }
    public string Difficulty { get; set; }
    public int Questions { get; set; }
}