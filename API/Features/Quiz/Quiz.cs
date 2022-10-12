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
        _quizState.Scoreboard.All(p => p.Value.Ready); // > 2;

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

        _quizState.Scoreboard[userId].Answered = true;
        await UpdateScoreboard();

        if (AllPlayersAnswered)
            await NextRound();
    }

    public Task JoinGame(Guid playerId, string name)
    {
        if (_quizState.GameStatus != GameStatus.AwaitingPlayers || _quizState.Scoreboard.Keys.Count == 4)
            throw new InvalidOperationException("Not able to join");
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
        _quizState.NumberOfPlayers = _quizState.Scoreboard.Keys.Count;

        //await SendRuntime();
        return Task.CompletedTask;
    }

    public async Task SetStatus(Guid playerId, bool status)
    {
        if (_quizState.Scoreboard.TryGetValue(playerId, out var value)) _quizState.Scoreboard[playerId].Ready = status;

        if (AllPlayersReady)
        {
            var usersready = new AllUsersReady(_quizState.GameId, AllPlayersReady);
            await _stream.OnNextAsync(usersready);
        }
        else
        {
            var usersReady = _quizState.Scoreboard.Values
                .Select(player => new PlayerReadyData { Id = player.Id, Name = player.Name, Ready = player.Ready })
                .ToList();

            var theseUsersReady = new PreGameUsers(_quizState.GameId, usersReady);
            await _stream.OnNextAsync(theseUsersReady);
        }
    }

    public async Task<bool> LeaveGame(Guid playerId)
    {
        if (_quizState.Scoreboard.TryGetValue(playerId, out var value))
        {
            _quizState.Scoreboard.Remove(playerId);
            _quizState.NumberOfPlayers = _quizState.Scoreboard.Count;
            await UpdateScoreboard();
        }

        // If 0, disband lobby
        return _quizState.Scoreboard.Keys.Count < 1;
    }

    public Task Initialize(Guid gameId, Guid ownerId, QuizCreationModel settings)
    {
        _quizState.GameId = gameId;
        _quizState.QuizSettings.Difficulty = settings.Difficulty;
        _quizState.QuizSettings.Type = settings.Type;
        _quizState.QuizSettings.Questions = settings.Questions;
        _quizState.Name = settings.Name;
        _quizState.OwnerId = ownerId;
        _quizState.Timeout = settings.Timeout;
        _quizState.GameMode = GameMode.Quiz;
        return Task.CompletedTask;
    }

    public async Task<bool> NextRound()
    {
        if (_quizState.QuestionStep == _quizState.Questions.Count)
        {
            await EndGame();
            return false;
        }

        // End round / Pre Next question
        var taskList = new List<Task>
        {
            _stream.OnNextAsync(new CorrectAnswer(_quizState.GameId,
                _quizState.Questions[_quizState.QuestionStep].correct_answer)),
            _stream.OnNextAsync(new FinishQuestion(_quizState.GameId))
        };
        await Task.WhenAll(taskList);
        await UpdateScoreboard();
        await Task.Delay(5000);

        // Reset and go next round
        foreach (var (key, value) in _quizState.Scoreboard)
        {
            _quizState.Scoreboard[key].Answered = false;
            _quizState.Scoreboard[key].AnsweredCorrectly = null;
        }

        _quizState.QuestionStep++;
        var newq = _quizState.Questions[_quizState.QuestionStep].ProcessQuestion(_quizState.QuestionStep);
        await UpdateScoreboard();
        await _stream.OnNextAsync(new NewQuestion(_quizState.GameId, newq));

        return true;
    }

    public async Task Start(Guid playerId)
    {
        if (_quizState.GameStatus != GameStatus.Ready && _quizState.OwnerId != playerId)
            throw new ArgumentException("Can't start game");
        if (!AllPlayersReady) throw new ArgumentException("All players not ready");
        _quizState.Questions = await _client.GetQuestions(_quizState.QuizSettings);
        _quizState.QuestionStep = 1;
        _quizState.GameStatus = GameStatus.InProgress;
        await SendRuntime();
        await Task.Delay(2000);
        var newq = _quizState.Questions[_quizState.QuestionStep].ProcessQuestion(_quizState.QuestionStep);
        await _stream.OnNextAsync(new NewQuestion(_quizState.GameId, newq));
        await UpdateScoreboard();
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

    public async Task SetTimer(int time)
    {
        var tickevent = new TimerTicked(_quizState.GameId, time);
        await _stream.OnNextAsync(tickevent);
    }

    public List<Guid> GetPlayerIds()
    {
        return _quizState.Scoreboard.Keys.ToList();
    }

    private void EnsureGameIsInProgress()
    {
        if (_quizState.GameStatus != GameStatus.InProgress)
            throw new InvalidOperationException("Game has already ended");
    }

    private bool IsCorrect(string answer)
    {
        return answer == _quizState.Questions[_quizState.QuestionStep].correct_answer;
    }

    private async Task EndGame()
    {
        _quizState.GameStatus = GameStatus.Finished;
        var endEvent = new GameEnded(_quizState.GameId);
        await _stream.OnNextAsync(endEvent);
    }

    private async Task UpdateScoreboard()
    {
        var users = _quizState.Scoreboard.Values.Select(user => new PlayerStateDto
            {
                Id = user.Id,
                Name = user.Name,
                Score = user.Score,
                Answered = user.Answered,
                AnsweredCorrectly = user.AnsweredCorrectly
            })
            .ToList();

        var scoreboardUpdated = new ScoreboardUpdated(_quizState.GameId, users);
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

    private async Task SendRuntime()
    {
        var info = new QuizRuntime
        {
            Status = _quizState.GameStatus,
            NumberOfQuestions = _quizState.QuizSettings.Questions,
            Timeout = _quizState.Timeout,
            OwnerId = _quizState.OwnerId,
            QuizSettings = _quizState.QuizSettings
        };
        await _stream.OnNextAsync(new QuizInfo(_quizState.GameId, info));
    }
}