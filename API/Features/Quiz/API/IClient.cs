using API.Features.Quiz.Dto;
using API.Features.Quiz.Models;

namespace API.Features.Quiz.API;

public interface IQuizClient
{
    Task<List<Result>> GetQuizzes(QuizCreationModel quizPost);
}