using API.Features.Common;
using API.Features.Quiz.API;

namespace API.Features.Quiz.Models;

public class QuizState : MultiplayerState
{
    public int QuestionStep { get; set; } = 0;
    public int NumberOfPlayers { get; set; }
    public int Timeout { get; set; }

    public QuizSettings QuizSettings { get; set; } = new();
    public ProcessedQuestion? CurrentQuestion { get; set; }
    public List<Result> Questions = new();
    public Dictionary<Guid, PlayerState> Scoreboard { get; set; } = new();
}

public class QuizRuntime
{
    public int QuestionStep { get; set; } = 0;
    public int NumberOfPlayers { get; set; }
    public int Timeout { get; set; }
    public QuizSettings QuizSettings { get; set; } = new();
    public ProcessedQuestion? CurrentQuestion { get; set; }
    public List<PlayerState> Scoreboard { get; set; } = new();
}

public class QuizResults
{
    public string Winner { get; set; }
    public List<PlayerResult> Scoreboard { get; set; } = new();
}