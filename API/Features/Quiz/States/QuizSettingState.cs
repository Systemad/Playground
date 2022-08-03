namespace API.Features.Quiz.States;

[Serializable]
public class QuizSettingState
{
    public Category Category { get; set; }
    public Difficulty Difficulty { get; set; }
    public int Questions { get; set; }
}