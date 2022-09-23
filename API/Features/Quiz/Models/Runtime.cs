using API.Features.Quiz.API;

namespace API.Features.Quiz.Models;

[Serializable]
public class Runtime
{
    public bool GameActive { get; set; }
    public ProcessedQuestion? CurrentQuestion { get; set; }
    public int Questions { get; set; }
    public int QuestionStep { get; set; }
    public int NumberOfPlayers { get; set; }
    public Settings Settings { get; set; } = new();
    public Scoreboard Scoreboard { get; set; } = new();

    //public Dictionary<Guid, PlayerRuntime> Scoreboard { get; set; } = new()
}