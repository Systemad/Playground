namespace API.Features.Quiz.Models;

public class LobbyPlayer
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool Ready { get; set; }
}

public class PlayerStateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public bool Answered { get; set; }
    public bool? AnsweredCorrectly { get; set; }
}

public class PlayerState
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public bool Answered { get; set; }
    public bool? AnsweredCorrectly { get; set; }
    public bool Ready { get; set; }
}

public class PlayerResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
}