namespace API.Features.Quiz.API;

public interface IQuizClient
{
    Task<Dictionary<int, Root>> GetQuizzes(QuizPost quizPost);
}