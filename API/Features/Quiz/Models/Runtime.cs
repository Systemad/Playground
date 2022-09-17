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
}