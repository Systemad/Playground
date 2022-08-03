using API.Features.Quiz.States;

namespace API.Features.Quiz.API;

public interface IQuizClient
{
    Task<List<Root>> GetQuizzes(QuizSettingState quizPost);
}