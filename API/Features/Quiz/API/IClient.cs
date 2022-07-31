namespace API.Features.Quiz.API;

public interface IQuizClient
{
    Task<List<Root>> GetQuizzes(QuizSettings quizPost);
}