using API.Features.Lobby;
using API.Features.Player;
using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Models;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz.Grains;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private const int MaxCapacity = 4;

    private readonly IOpenTdbClient _client;
    private Result? _currentQuestion;
    private Runtime _runtime;

    //private IDisposable _timer;
    //private bool _timerActive;

    private readonly IPersistentState<State> _state;
    private readonly IPersistentState<Settings> _settings;

    private static string GrainType => nameof(QuizGrain);
    private Guid GrainKey => this.GetPrimaryKey();
    private readonly IHubContext<GlobalHub> _hubContext;

    public QuizGrain(
        [PersistentState("quiz", "quizStore")] IPersistentState<State> state,
        [PersistentState("settings", "settingStore")]
        IPersistentState<Settings> settings,
        IHubContext<GlobalHub> hubContext, IOpenTdbClient client)
    {
        _hubContext = hubContext;
        _client = client;
        _settings = settings;
        _state = state;
        _runtime = new Runtime
        {
            GameActive = false,
            CurrentQuestion = null,
            Questions = 0,
            QuestionStep = 0,
            NumberOfPlayers = 0
        };
    }

    public override async Task OnActivateAsync()
    {
        await base.OnActivateAsync();
    }

    public async Task CreateGame(Guid ownerId, QuizCreationModel settings)
    {
        var quizSettings = settings.ToSettingsState();
        _settings.State = quizSettings;
        _settings.State.OwnerUserId = ownerId;
        _state.State.GameState = GameState.AwaitingPlayers;
        await _state.WriteStateAsync();
        await _settings.WriteStateAsync();
        await AddPlayer(ownerId);
        await UpdateGameToLobby();
    }

    public async Task AddPlayer(Guid playerId)
    {
        var player = GrainFactory.GetGrain<IPlayerGrain>(playerId);
        var username = await player.GetUsername();
        var runtime = new PlayerRuntime
        {
            Id = playerId,
            Name = username,
            Score = 0,
            Answered = false,
            AnsweredCorrectly = null,
            Ready = true
        };
        _state.State.Scoreboard[playerId] = runtime;
        await _state.WriteStateAsync();
        await SendScoreboard();
    }

    public async Task RemovePlayer(Guid playerId)
    {
        try
        {
            _state.State.Players.Remove(playerId);
            await _state.WriteStateAsync();
            await UpdateGameToLobby();
            await SendScoreboard();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task SubmitAnswer(Guid playerId, string answer)
    {
        if (_state.State.GameState != GameState.InProgress) throw new ArgumentException("Game is over");
        if (IsCorrect(answer))
        {
            _state.State.Scoreboard[playerId].Score++;
            _state.State.Scoreboard[playerId].AnsweredCorrectly = true;
        }

        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.PlayerAnswered), playerId);
        if (_state.State.Scoreboard.Values.Count(v => v.Answered is true) ==
            _state.State.Scoreboard.Keys.Count) await NextQuestion();
    }

    public Task<Runtime> GetGameRuntime()
    {
        return Task.FromResult(_runtime);
    }

    public Task<Scoreboard> GetGameScoreboard()
    {
        var board = new Scoreboard
        {
            GameId = GrainKey,
            Players = _state.State.Scoreboard.Values.ToList()
        };
        return Task.FromResult(board);
    }

    public Task<GameResult> GetQuizResults()
    {
        return Task.FromResult(Helpers.ProcessResult(GrainKey, _state.State, _settings.State));
    }

    public async Task SetPlayerStatus(Guid playerId, bool status)
    {
        var player = _state.State.Scoreboard.FirstOrDefault(x => x.Key == playerId);
        player.Value.Ready = status;
        await _hubContext.Clients.Group(GrainKey.ToString())
            .SendAsync(nameof(Events.PlayerStatusChange), playerId, status);
        await CheckAndUpdateStatus();
    }

    public async Task StartGame(Guid? playerId)
    {
        if (_state.State.GameState != GameState.Ready) throw new ArgumentException("Game is not ready");
        if (playerId != _settings.State.OwnerUserId) throw new ArgumentException("Not owner id");
        _state.State.GameState = GameState.InProgress;
        _state.State.Questions = await _client.GetQuestions(_settings.State);
        _runtime.CurrentQuestion = _currentQuestion.ProcessQuestion();
        _currentQuestion = _state.State.Questions[_runtime.QuestionStep];

        /*
        _timer = RegisterTimer(null,
            null,
            TimeSpan.FromSeconds(10),
            TimeSpan.FromSeconds(1));
        */
        await _settings.WriteStateAsync();
        await UpdateGameToLobby();
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.StartGame), _runtime);
    }

    public async Task SetGameSettings(QuizCreationModel quizPost)
    {
        var news = quizPost.ToSettingsState();
        _settings.State = news;
        await _settings.WriteStateAsync();
        await UpdateGameToLobby();
    }

    private async Task CheckAndUpdateStatus()
    {
        var readyplayers = _state.State.Scoreboard.Values.Count(v => v.Ready == true);
        var ready = readyplayers == _state.State.Scoreboard.Values.Count;
        var state = _state.State.GameState;

        if (state is GameState.Finished) throw new ApplicationException("Game finished");
        if (state is GameState.InProgress) throw new ApplicationException("Game is in progress");
        if (!(_state.State.Scoreboard.Keys.Count <= MaxCapacity)) throw new ArgumentException("Game is full");

        if (state is GameState.AwaitingPlayers && ready)
        {
            _state.State.GameState = GameState.Ready;
            await _state.WriteStateAsync();
            await UpdateGameToLobby();
        }
    }

    private async Task UpdateGameToLobby()
    {
        var gameSummary = new GameLobbySummary
        {
            Id = GrainKey,
            Name = _settings.State.Name,
            Mode = GameMode.Quiz,
            Players = _state.State.Scoreboard.Keys.Count,
            State = _state.State.GameState,
            Difficulty = _settings.State.Difficulty
        };
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddOrUpdateGame(gameSummary.Id, gameSummary);
    }

    private bool IsCorrect(string answer)
    {
        return answer == _currentQuestion.correct_answer;
    }

    private async Task StopGame()
    {
        //_timer.Dispose();
        _currentQuestion = null;
        _runtime.CurrentQuestion = null;
        _state.State.GameState = GameState.Finished;
        await _state.WriteStateAsync();
        await _hubContext.Clients.Group(GrainKey.ToString()).SendAsync(nameof(Events.StopGame), true);
    }

    private async Task PreparePlayer(Guid id)
    {
        var player = GrainFactory.GetGrain<IPlayerGrain>(id);
        var runtime = new PlayerRuntime
        {
            Id = id,
            Name = await player.GetUsername(),
            Score = 0,
            Answered = false,
            AnsweredCorrectly = null,
            Ready = true
        };
        _state.State.Scoreboard[id] = runtime;
        await _state.WriteStateAsync();
    }

    private async Task NextQuestion()
    {
        //_timer.Dispose();
        //_timerActive = false;

        if (_runtime.QuestionStep == _state.State.Questions.Count && _state.State.GameState == GameState.InProgress)
        {
            await StopGame();
        }
        else
        {
            /* Implement timer at later stage
            _timer = RegisterTimer(null,
                null,
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(1));
            */

            await SendRoundResults();
            await NextRound();
        }
    }

    private async Task NextRound()
    {
        foreach (var (key, value) in _state.State.Scoreboard)
        {
            _state.State.Scoreboard[key].Answered = false;
            _state.State.Scoreboard[key].AnsweredCorrectly = null;
        }

        _runtime.QuestionStep++;
        _currentQuestion = _state.State.Questions[_runtime.QuestionStep];
        await _state.WriteStateAsync();

        await SendScoreboard();
        await SendQuestion();
    }

    private async Task SendRoundResults()
    {
        await SendScoreboard();
        await _hubContext.Clients.Group(GrainKey.ToString())
            .SendAsync(nameof(Events.CorrectAnswer), _currentQuestion.correct_answer);
    }

    private async Task PostQuestion()
    {
        await SendScoreboard();
    }

    private async Task SendScoreboard()
    {
        var board = new Scoreboard
        {
            GameId = GrainKey,
            Players = _state.State.Scoreboard.Values.ToList()
        };
        await _hubContext.Clients.Group(GrainKey.ToString())
            .SendAsync(nameof(Events.UpdateScoreboard), board);
    }

    private async Task SendQuestion()
    {
        var question = Helpers.ProcessQuestion(_currentQuestion);
        await _hubContext.Clients.Group(GrainKey.ToString())
            .SendAsync(nameof(Events.NextRound), question);
    }
}