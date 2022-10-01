using API.Features.Quiz.Dto;
using API.Features.Quiz.Models;

namespace API.Features.Quiz.Interfaces;

public interface IQuizGrain : IMultiplayerGrain
{
    Task SubmitAnswer(Guid playerId, string answer);
    Task CreateGame(Guid ownerId, QuizCreationModel settings);
    
    //Task<GameResult> GetQuizResults();
}