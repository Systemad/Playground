using API.Features.Common;
using API.Features.Quiz.API;

namespace API.Features.Quiz.Models;

public class QuizState : MultiplayerState
{
    public int QuestionStep { get; set; } = 0;
    public int NumberOfPlayers { get; set; }
    public int Timeout { get; set; }

    public QuizSettings QuizSettings { get; set; } = new();

    //public Result? CurrentQuestion { get; set; }
    public List<Result> Questions = new();

    // use hook for scoreboard
    public Dictionary<Guid, PlayerState> Scoreboard { get; set; } = new();
}

public class QuizRuntime
{
    public int NumberOfQuestions { set; get; }
    public int Timeout { get; set; }
    public Guid OwnerId { get; set; }
    public QuizSettings QuizSettings { get; set; } = new();
}

public class QuizResults
{
    public string Winner { get; set; }
    public List<PlayerResult> Scoreboard { get; set; } = new();
}