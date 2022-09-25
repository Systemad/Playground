namespace API.Features.Quiz.Models;

public class QuizSettings
{
    public string Type { get; set; }
    public string Category { get; set; }
    public string Difficulty { get; set; }
    public int Questions { get; set; }
}