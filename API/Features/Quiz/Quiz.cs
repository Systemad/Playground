using API.Features.Common;
using API.Features.Quiz.Models;

namespace API.Features.Quiz;

public class Quiz : IMultiplayerMatch
{
    private Runtime _runtime;

    public Quiz(Runtime runtime)
    {
        _runtime = runtime;
    }


    public Task SubmitGuess(Guid userId, string answer)
    {
        throw new NotImplementedException();
    }
}