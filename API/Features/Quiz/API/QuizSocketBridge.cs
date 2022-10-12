using API.Features.Player;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Streams;

namespace API.Features.Quiz.API;

public interface ISubscriber : IGrainWithGuidKey
{
}

[ImplicitStreamSubscription(Constants.QuizNamespace)]
public class QuizSocketBridge : Grain, ISubscriber
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
            case ScoreboardUpdated obj:
                return await Handle(obj);
            case GameStarted obj:
                return await Handle(obj);
            case GameEnded obj:
                return await Handle(obj);
            case TimerTicked obj:
                return await Handle(obj);
            case CorrectAnswer obj:
                return await Handle(obj);
            case NewQuestion obj:
                return await Handle(obj);
            case AllUsersReady obj:
                return await Handle(obj);
            case FinishQuestion obj:
                return await Handle(obj);
            case QuizInfo obj:
                return await Handle(obj);
            case PreGameUsers obj:
                return await Handle(obj);
            default:
                return false;
        }
    }

    private async Task<bool> Handle(TimerTicked evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.TimerUpdate, evt.Timer);
        return true;
    }

    private async Task<bool> Handle(QuizInfo evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.QuizRuntime, evt.Runtime);
        return true;
    }

    private async Task<bool> Handle(PreGameUsers evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.PreGameUsers, evt.Players);
        return true;
    }

    private async Task<bool> Handle(NewQuestion evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.NewQuestion, evt.Question);
        return true;
    }

    private async Task<bool> Handle(FinishQuestion evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.FinishQuestion);
        return true;
    }

    private async Task<bool> Handle(CorrectAnswer evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.CorrectAnswer, evt.Question);
        return true;
    }

    private async Task<bool> Handle(GameEnded evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.StopGame);
        return true;
    }

    private async Task<bool> Handle(GameStarted evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.StartGame);
        return true;
    }


    private async Task<bool> Handle(ScoreboardUpdated evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString())
            .SendAsync(WsEvents.UpdateScoreboard, evt.Scoreboard);
        return true;
    }

    private async Task<bool> Handle(AllUsersReady evt)
    {
        await _hub.Clients.Group(evt.GameId.ToString()).SendAsync(WsEvents.UsersReady, evt.Status);
        return true;
    }

    public override async Task OnDeactivateAsync()
    {
        await _subscriptionHandle!.UnsubscribeAsync();
        await base.OnDeactivateAsync();
    }
}