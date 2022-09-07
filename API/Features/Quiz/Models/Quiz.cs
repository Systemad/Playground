using API.Features.Quiz.API;

namespace API.Features.Quiz.Models;

[Serializable]
public class QuizState
{
    public GameState GameState { get; set; }
    public List<Result> Questions { get; set; }
    
    public HashSet<Guid> Players { get; set; }

    public Dictionary<Guid, PlayerRuntime> Scoreboard { get; set; }
}

[Serializable]
public class QuizSettingState
{
    public Guid OwnerUserId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Category { get; set; }
    public string Difficulty { get; set; }
    public int Questions { get; set; }
}
