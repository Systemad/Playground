using API.Features.Quiz.API;

namespace API.Features.Quiz.Models;

[Serializable]
public class Runtime
{
    public bool GameActive { get; set; }
    public Result CurrentQuestion { get; set; }
    public int Questions { get; set; }
    public int QuestionStep { get; set; }
    public int NumberOfPlayers { get; set; }
    public List<Player.Player> Players { get; set; }
}