using API.Features.Lobby;
using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace API.Features.Quiz.Grains;

[Reentrant]
public class QuizGrain : Grain, IQuizGrain
{
    private readonly ILogger _logger;
    private const int MaxCapacity = 4;
    private Quiz _game;
    private QuizGrainOptions _options;

    private int _tick;
    private IDisposable? _timer;

    //private readonly IPersistentState<QuizState> _state;

    private static string GrainType => nameof(QuizGrain);
    private Guid GrainKey => this.GetPrimaryKey();

    public QuizGrain(ILogger<QuizGrain> logger, QuizGrainOptions options)
    {
        _logger = logger;
        _options = options;
    }

    public override async Task OnActivateAsync()
    {
        var streamProvider = GetStreamProvider(Constants.InMemorySteam);
        var stream = streamProvider.GetStream<object>(GrainKey, Constants.QuizNamespace);
        var initState = new QuizState();
        _game = new Quiz(initState, stream);
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
        var summary = await _game.GetLobbySummary();
        var lobbyGrain = GrainFactory.GetGrain<ILobbyGrain>(0);
        await lobbyGrain.AddOrUpdateGame(summary.Id, summary);
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