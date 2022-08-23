using System.Runtime.Serialization;
using API.Features.Quiz.API;

namespace API.Features.Quiz;

[Serializable]
public struct AnswerModel
{
    public Guid GameId { get; set; }
    public string Answer { get; set; }
}

[Serializable]
public enum AnsweredState
{
    Answered = 1,
    NotAnswered = 2
}

[Serializable]
public enum AnswerResult
{
    Correct,
    Incorrect,
}

public class PlayerRuntime
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public bool Answered { get; set; }
}

[Serializable]
public class QuizRuntime
{
    public bool GameActive { get; set; }
    public Result CurrentQuestion { get; set; }
    public int Questions { get; set; }
    public int QuestionStep { get; set; }
    public int NumberOfPlayers { get; set; }
    public List<Player.Player> Players { get; set; }
}

public class QuizInfo
{
    public Guid Id { get; set; }
    public Guid Name { get; set; }
    public GameState State { get; set; }
    public string Category { get; set; }
}