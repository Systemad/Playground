using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using Orleans.Streams;

namespace API.Features.Quiz;

// TODO: Add SignalR events
public class Quiz : IQuiz
{
    private readonly QuizState _quizState;
    private readonly IOpenTdbClient _client;
    private IAsyncStream<object> _stream;
    private IStreamProvider _streamProvider;

    private bool allPlayersAnswered =>
        _quizState.Scoreboard.All(p => p.Value.Answered == true);

    private bool allPlayersReady =>
        _quizState.Scoreboard.All(p => p.Value.Ready == true);

    public Quiz(QuizState quizState, IOpenTdbClient client, IStreamProvider streamProvider)
    {
        _quizState = quizState;
        _client = client;
        _streamProvider = streamProvider;
    }

    public Task SubmitGuess(Guid userId, string answer)
    {
        EnsureGameIsInProgress();
        if (IsCorrect(answer))
        {
            _quizState.Scoreboard[userId].Score++;
            _quizState.Scoreboard[userId].AnsweredCorrectly = true;
        }

        if (allPlayersAnswered)
            ResetRound();
        else
            NextRound();
        return Task.CompletedTask;
    }

    public Task SetStatus(Guid userId, bool status)
    {
        _quizState.Scoreboard[userId].Ready = status;
        return Task.CompletedTask;
    }

    public async Task JoinGame(Guid userId, string name)
    {
        var newPlayer = new PlayerState
        {
            Id = userId,
            Name = name,
            Score = 0,
            Answered = false,
            AnsweredCorrectly = null,
            Ready = true
        };
        _quizState.Scoreboard[userId] = newPlayer;
        var join = new PlayerJoined(newPlayer, userId);
        await _stream.OnNextAsync(join);
    }

    public Task LeaveGame(Guid userId)
    {
        _quizState.Scoreboard.Remove(userId);
        return Task.CompletedTask;
    }

    public Task Initialize(Guid gameId, Guid ownerId, QuizCreationModel settings)
    {
        _quizState.GameId = gameId;
        _quizState.QuizSettings.Difficulty = settings.Difficulty;
        _quizState.QuizSettings.Type = settings.Type;
        _quizState.QuizSettings.Questions = settings.Questions;
        _quizState.Name = settings.Name;
        _quizState.ownerId = ownerId;
        _quizState.Timeout = settings.Timeout;
        _stream = _streamProvider.GetStream<object>(gameId, Constants.QuizNamespace);
        return Task.CompletedTask;
    }

    public Task NextRound()
    {
        ResetRound();
        return Task.CompletedTask;
    }

    private void ResetRound()
    {
        foreach (var (key, value) in _quizState.Scoreboard)
        {
            _quizState.Scoreboard[key].Answered = false;
            _quizState.Scoreboard[key].AnsweredCorrectly = null;
        }

        _quizState.QuestionStep++;
        _quizState.CurrentQuestion = _quizState.Questions[_quizState.QuestionStep].ProcessQuestion();
    }

    public async Task Start(Guid playerId)
    {
        if (!_quizState.Active && _quizState.ownerId != playerId)
            throw new ArgumentException("Can't start game");
        if (!allPlayersReady) throw new ArgumentException("All players not ready");
        _quizState.Active = true;
        _quizState.Questions = await _client.GetQuestions(_quizState.QuizSettings);
        _quizState.CurrentQuestion = _quizState.Questions[1].ProcessQuestion();
    }

    public Task<GameLobbySummary> GetLobbySummary()
    {
        var lobby = new GameLobbySummary
        {
            Id = _quizState.GameId,
            Name = _quizState.Name,
            Mode = _quizState.GameMode,
            Players = _quizState.NumberOfPlayers,
            Status = _quizState.GameStatus,
            Difficulty = _quizState.QuizSettings.Difficulty
        };
        return Task.FromResult(lobby);
    }

    public Task<QuizRuntime> GetGameState()
    {
        var scoreboard = _quizState.Scoreboard.Values.ToList();
        var lobby = new QuizRuntime
        {
            QuestionStep = _quizState.QuestionStep,
            NumberOfPlayers = _quizState.NumberOfPlayers,
            Timeout = _quizState.Timeout,
            QuizSettings = _quizState.QuizSettings,
            CurrentQuestion = _quizState.CurrentQuestion,
            Scoreboard = scoreboard
        };
        return Task.FromResult(lobby);
    }

    public async Task SetTimer(int time)
    {
        var tickevent = new TimerTicked(time, _quizState.GameId);
        await _stream.OnNextAsync(tickevent);
    }

    private void EnsureGameIsInProgress()
    {
        if (!_quizState.Active) throw new InvalidOperationException("Game has already ended.");
    }

    private bool IsCorrect(string answer)
    {
        return answer == _quizState.Questions[_quizState.QuestionStep].correct_answer;
    }

    private Task EndGame()
    {
        _quizState.Active = false;
        _quizState.CurrentQuestion = null;
        return Task.CompletedTask;
    }

    private Task CalculateAndReturnResults()
    {
        var scoreboard = _quizState.Scoreboard.Values.ToList();
        var playeresults = scoreboard.Select(player => new PlayerResult
            { Id = player.Id, Name = player.Name, Score = player.Score }).OrderByDescending(v => v.Score).ToList();
        ;
        var results = new QuizResults
        {
            Winner = playeresults.First().Name,
            Scoreboard = playeresults
        };

        return Task.FromResult(results);
    }
}