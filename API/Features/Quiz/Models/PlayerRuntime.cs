namespace API.Features.Quiz.Models;

public class PlayerRuntime
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public bool Answered { get; set; }
    public bool Ready { get; set; }
}