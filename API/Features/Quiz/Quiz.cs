using System.Collections.Concurrent;
using System.Runtime.Serialization;
using API.Features.Quiz.API;

namespace API.Features.Quiz;

[Serializable]
public enum Category
{
    [EnumMember(Value = "linux")]
    Linux,
    
    [EnumMember(Value = "devops")]
    DevOps,
    
    [EnumMember(Value = "networking")]
    Networking,
    
    [EnumMember(Value = "programming")]
    Programming,
    
    [EnumMember(Value = "cloud")]
    Cloud
}

[Serializable]
public enum Answer
{
    A,
    B,
    C, 
    D
}

[Serializable]
public struct AnswerModel
{
    public Guid GameId { get; set; }
    public string Answer { get; set; }
}

public enum Difficulty
{
    [EnumMember(Value = "easy")]
    Easy,
    
    [EnumMember(Value = "medium")]
    Medium,
    
    [EnumMember(Value = "hard")]
    Hard
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
    public Category Category { get; set; }
}