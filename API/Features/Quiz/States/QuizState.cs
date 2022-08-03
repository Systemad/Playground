using System.Collections.Concurrent;
using API.Features.Quiz.API;

namespace API.Features.Quiz.States;

[Serializable]
public class QuizState
{
    public Guid OwnerUserId { get; set; }
    public string Name { get; set; }
    public GameState GameState { get; set; }
    public List<Root> Questions { get; set; }
    public ConcurrentDictionary<Guid, int> PlayerScores { get; set; }
}