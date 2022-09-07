namespace API.Features.Quiz.Models;

public class QuizInfo
{
    public Guid Id { get; set; }
    public Guid Name { get; set; }
    public GameState State { get; set; }
    public string Category { get; set; }
}

public class QuizInfoDTO
{
    public Guid Id { get; set; }
    public Guid Name { get; set; }
    public GameState State { get; set; }
    public string Category { get; set; }
}