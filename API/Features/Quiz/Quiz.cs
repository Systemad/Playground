using System.Runtime.Serialization;

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
    Correct = 1,
    Incorrect = 2
}

[Serializable]
public struct QuizSummary
{
    public Guid GameId { get; set; }
    public GameState State { get; set; }
    public Category Category { get; set; }
    public int CorrectAnswers { get; set; }
    public int InCorrectAnswers { get; set; }
    public int NumberOfPlayers { get; set; }
    public string[] Usernames { get; set; } // TODO: Replace with Accounts?
}