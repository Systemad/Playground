using API.Features.Quiz.API;

namespace API.Features.Quiz;

[Serializable]
public class QuizState
{
    public Guid OwnerUserId { get; set; }
    public string Name { get; set; }
    public GameState GameState { get; set; }
    public List<Result> Questions { get; set; }
    
    public HashSet<Guid> Players { get; set; } = new();

    public Dictionary<Guid, PlayerRuntime> Scoreboard { get; set; } = new();
}

[Serializable]
public class QuizSettingState
{
    public string Category { get; set; }
    public string Difficulty { get; set; }
    public int Questions { get; set; }
}
