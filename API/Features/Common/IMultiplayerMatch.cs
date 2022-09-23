namespace API.Features.Common;

public interface IMultiplayerMatch
{
    Task SubmitGuess(Guid userId, string answer);
}