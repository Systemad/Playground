namespace API.Features.Quiz.API;

public interface IQuizClient
{
    Task<List<Result>> GetQuizzes(QuizSettingState quizPost);
}