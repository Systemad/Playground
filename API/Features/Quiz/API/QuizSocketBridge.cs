using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Streams;

namespace API.Features.Quiz.API;

[ImplicitStreamSubscription(Constants.QuizNamespace)]
public class QuizSocketBridge : Grain, IGrainWithGuidKey
{
    private StreamSubscriptionHandle<object>? _subscriptionHandle;
    private IHubContext<GlobalHub> _hub;
    private ILogger<QuizSocketBridge> _logger;
    private IStreamProvider? StreamProvider;

    public QuizSocketBridge(IHubContext<GlobalHub> hub, ILogger<QuizSocketBridge> logger)
    {
        _hub = hub;
        _logger = logger;
    }

    public override async Task OnActivateAsync()
    {
        StreamProvider = GetStreamProvider(Constants.InMemorySteam);
        _subscriptionHandle = await StreamProvider.GetStream<object>(this.GetPrimaryKey(), Constants.QuizNamespace)
            .SubscribeAsync(HandleAsync);
        _logger.LogInformation("Stream activated for {grainKey}", this.GetPrimaryKey());
        await base.OnActivateAsync();
    }

    private async Task<bool> HandleAsync(object evt, StreamSequenceToken token)
    {
        switch (evt)
        {
            case PlayerStatusChanged obj:
                return await Handle(obj);
            case PlayerAnswered obj:
                return await Handle(obj);
            case GameStarted obj:
                return await Handle(obj);
            case GameEnded obj:
                return await Handle(obj);
            case GameReady obj:
                return await Handle(obj);
            case RoundStarted obj:
                return await Handle(obj);
            case RoundEnded obj:
                return await Handle(obj);
            case TimerTicked obj:
                return await Handle(obj);
            default:
                return false;
        }
    }

    private async Task<bool> Handle(PlayerStatusChanged evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.ChangePlayerStatus), evt.InvokerId, evt.Status);
        return true;
    }

    private async Task<bool> Handle(TimerTicked evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.TimerTicked), evt);
        return true;
    }

    private async Task<bool> Handle(PlayerAnswered evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.PlayerAnswered), evt.InvokerId);
        return true;
    }

    private async Task<bool> Handle(GameStarted evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.StartGame), evt.Runtime);
        return true;
    }

    private async Task<bool> Handle(GameEnded evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.StopGame));
        return true;
    }

    private async Task<bool> Handle(GameReady evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.StopGame), evt.Runtime);
        return true;
    }

    private async Task<bool> Handle(RoundEnded evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.RoundResults), evt.CorrectAnswer, evt.Runtime.Scoreboard);
        return true;
    }

    private async Task<bool> Handle(RoundStarted evt)
    {
        await _hub.Clients.Group(this.GetPrimaryKey().ToString())
            .SendAsync(nameof(WsEvents.NextRound), evt.Runtime);
        return true;
    }

    public override async Task OnDeactivateAsync()
    {
        await _subscriptionHandle!.UnsubscribeAsync();
        await base.OnDeactivateAsync();
    }

}
/*

public record ScoreboardUpdated(List<PlayerState> Scoreboard, Guid InvokerId) : IEvent;
*/