using System.Collections.Concurrent;
using API.Features.Common;
using API.Features.Quiz.API;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace API.Features.Quiz.Models;

public class QuizState : MultiplayerState
{
    public int QuestionStep { get; set; } = 0;
    public int NumberOfPlayers { get; set; }
    public int Timeout { get; set; }
    public QuizSettings QuizSettings { get; set; } = new();
    public List<Result> Questions = new();
    public ConcurrentDictionary<Guid, PlayerState> Scoreboard { get; set; } = new();
}

public class QuizRuntime
{
    public Guid GameId { get; set; }
    public Guid OwnerId { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public GameStatus Status { get; set; }

    public int NumberOfQuestions { set; get; }
    public int Timeout { get; set; }
    public QuizSettings Settings { get; set; } = new();

    public ProcessedQuestion? CurrentQuestion { get; set; }
    public List<PlayerStateDto> Scoreboard { get; set; } = new();
}

public class QuizResults
{
    public string Winner { get; set; }
    public List<PlayerResult> Scoreboard { get; set; } = new();
}