namespace API.Features.Quiz.Models;

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