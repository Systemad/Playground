namespace API.Features.Quiz.Grains;

public abstract class QuizGrainOptions
{
    public int Timeout { get; set; } = 30;
}