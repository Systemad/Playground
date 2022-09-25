using API.Features.Lobby;
using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz.Grains;

// TODO: Make Class that has game and logic
// https://github.com/smolyakoff/conreign/blob/master/src/Conreign.Server/Gameplay/GameGrain.cs#L20
// Then take mewoki bot Trivia inpsiration
[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private readonly ILogger _logger;
    private const int MaxCapacity = 4;
    private Quiz _game;
    private QuizGrainOptions _options;

    private int _tick;
    private IDisposable? _timer;

    private readonly IPersistentState<QuizState> _state;

    private static string GrainType => nameof(QuizGrain);
    private Guid GrainKey => this.GetPrimaryKey();

    public QuizGrain(IOpenTdbClient client, ILogger<QuizGrain> logger)
    {
        _logger = logger;
    }

    public override async Task OnActivateAsync()
    {
        await base.OnActivateAsync();
    }

    public async Task CreateGame(Guid ownerId, QuizCreationModel settings)
    {
        await _game.Initialize(GrainKey, ownerId, settings);
        _options.Timeout = settings.Timeout;
        await UpdateGameToLobby();
    }

    public async Task AddPlayer(Guid playerId, string name)
    {
        await _game.JoinGame(playerId, name);
    }

    public async Task RemovePlayer(Guid playerId)
    {
        try
        {
            await _game.LeaveGame(playerId);
        }
        catch (Exception e)
        {
            _logger.LogError("QuizGrain: RemovePlayer ERROR - {playerId}", playerId);
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task SubmitAnswer(Guid playerId, string answer)
    {
        await _game.SubmitGuess(playerId, answer);
    }

    public Task<QuizRuntime> GetGameRuntime()
    {
        return _game.GetGameState();
    }

    public async Task SetPlayerStatus(Guid playerId, bool status)
    {
        await _game.SetStatus(playerId, status);
    }

    public async Task StartGame(Guid playerId)
    {
        await _game.Start(playerId);
        await UpdateGameToLobby();
    }

    private async Task UpdateGameToLobby()
    {
        var gameSummary = new GameLobbySummary
        {
        };
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddOrUpdateGame(gameSummary.Id, gameSummary);
    }


    private async Task Tick(object arg)
    {
        if (_timer == null) return;
        _tick++;
        if (_tick == _options.Timeout)
        {
            await _game.NextRound();
            ScheduleTimer();
        }
        else
        {
            await _game.SetTimer(_tick);
        }
    }

    private void ScheduleTimer()
    {
        StopTimer();
        _timer = RegisterTimer(
            Tick,
            null,
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(_options.Timeout));
    }

    private void StopTimer()
    {
        _tick = 0;
        _timer?.Dispose();
        _timer = null;
    }
}