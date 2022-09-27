using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using Orleans.Streams;

namespace API.Features.Quiz;

public class Quiz : IQuiz
{
    private readonly QuizState _quizState;
    private readonly IOpenTdbClient _client;
    private readonly IAsyncStream<object> _stream;

    private bool AllPlayersAnswered =>
        _quizState.Scoreboard.All(p => p.Value.Answered);

    private bool AllPlayersReady =>
        _quizState.Scoreboard.All(p => p.Value.Ready);

    public Quiz(QuizState quizState, IAsyncStream<object> stream)
    {
        _quizState = quizState;
        _client = new OpenTdbClient();
        _stream = stream;
    }

    public async Task SubmitGuess(Guid userId, string answer)
    {
        EnsureGameIsInProgress();
        if (IsCorrect(answer))
        {
            _quizState.Scoreboard[userId].Score++;
            _quizState.Scoreboard[userId].AnsweredCorrectly = true;
        }

        if (AllPlayersAnswered)
            ResetRound();
        else
            await NextRound();
    }

    public async Task SetStatus(Guid playerId, bool status)
    {
        if (_quizState.Scoreboard.TryGetValue(playerId, out var value))
        {
            var gameId = _quizState.GameId;
            _quizState.Scoreboard[playerId].Ready = status;
            await UpdateScoreboard();
        }

        if (AllPlayersReady)
        {
            var usersready = new AllUsersReady(_quizState.GameId);
            await _stream.OnNextAsync(usersready);
        }
    }

    public async Task JoinGame(Guid playerId, string name)
    {
        var newPlayer = new PlayerState
        {
            Id = playerId,
            Name = name,
            Score = 0,
            Answered = false,
            AnsweredCorrectly = null,
            Ready = false
        };
        _quizState.Scoreboard[playerId] = newPlayer;
        _quizState.NumberOfPlayers = _quizState.Scoreboard.Count;
        await UpdateScoreboard();
    }

    public async Task LeaveGame(Guid playerId)
    {
        if (_quizState.Scoreboard.TryGetValue(playerId, out var value))
        {
            _quizState.Scoreboard.Remove(playerId);
            _quizState.NumberOfPlayers = _quizState.Scoreboard.Count;
            await UpdateScoreboard();
        }
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
        return Task.CompletedTask;
    }

    public async Task NextRound()
    {
        if (_quizState.QuestionStep == _quizState.Questions.Count)
            await EndGame();
        else
            ResetRound();
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

    // TODO: Fix
    public async Task Start(Guid playerId)
    {
        if (!_quizState.Active && _quizState.ownerId != playerId)
            throw new ArgumentException("Can't start game");
        if (!AllPlayersReady) throw new ArgumentException("All players not ready");
        _quizState.Active = true;
        _quizState.Questions = await _client.GetQuestions(_quizState.QuizSettings);
        _quizState.CurrentQuestion = _quizState.Questions[1].ProcessQuestion();
        var runtime = await GetGameState();
        var startGameEvent = new GameStarted(_quizState.GameId, runtime);
        await _stream.OnNextAsync(startGameEvent);
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
            Active = _quizState.Active,
            QuestionStep = _quizState.QuestionStep,
            NumberOfQuestions = _quizState.Questions.Count,
            NumberOfPlayers = _quizState.NumberOfPlayers,
            Timeout = _quizState.Timeout,
            OwnerId = _quizState.ownerId,
            QuizSettings = _quizState.QuizSettings,
            CurrentQuestion = _quizState.CurrentQuestion,
            Scoreboard = scoreboard
        };
        return Task.FromResult(lobby);
    }

    public async Task SetTimer(int time)
    {
        var tickevent = new TimerTicked(_quizState.GameId, time);
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

    private async Task EndGame()
    {
        _quizState.Active = false;
        _quizState.CurrentQuestion = null;
        var endEvent = new GameEnded(_quizState.GameId);
        await _stream.OnNextAsync(endEvent);
    }

    private async Task UpdateScoreboard()
    {
        var scoreboardUpdated = new ScoreboardUpdated(_quizState.GameId, _quizState.Scoreboard.Values.ToList());
        await _stream.OnNextAsync(scoreboardUpdated);
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