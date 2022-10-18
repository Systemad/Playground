using API.Features.Common;

namespace API.Features.Quiz.Interfaces;

public interface IQuiz : IMultiplayerMatch
{
    Task SubmitGuess(Guid playerId, string answer);
}