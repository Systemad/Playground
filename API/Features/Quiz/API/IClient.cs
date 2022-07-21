namespace API.Features.Quiz.API;

public interface IQuizClient
{
    Task<Root[]> GetQuizzes(QuizPost quizPost);
}