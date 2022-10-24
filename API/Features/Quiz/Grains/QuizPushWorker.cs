using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using API.Features.SignalR;
using Microsoft.AspNetCore.SignalR;
using Orleans;
using Orleans.Concurrency;

namespace API.Features.Quiz.Grains;

[StatelessWorker]
public class QuizPushWorker : Grain, IQuizPushWorker
{
    private readonly IHubContext<QuizHub> _hub;

    public QuizPushWorker(IHubContext<QuizHub> hubContext)
    {
        _hub = hubContext;
    }

    public Task OnTimerTicked(Guid gameId, int timer)
    {
        return _hub.Clients.Group(gameId.ToString()).SendAsync(WsEvents.TimerUpdate, timer);
    }

    public Task OnUpdateGame(Guid gameId, QuizRuntime runtime)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.GameUpdated, runtime);
    }

    public Task OnLobbyUpdated(Guid gameId, List<LobbyPlayer> players)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.LobbyPlayers, players);
    }

    public Task OnStatusUpdate(Guid gameId, GameStatus status)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.UpdateStatus, status);
    }

    public async Task OnNewQuestion(Guid gameId, ProcessedQuestion question)
    {
        await _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.NewQuestion, question);
    }

    public Task OnFinishQuestion(Guid gameId)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.FinishQuestion);
    }

    public Task OnCorrectAnswer(Guid gameId, string question)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.CorrectAnswer, question);
    }

    public Task OnAllPlayersReady(Guid gameId, bool status)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.UsersReady, status);
    }

    public Task OnScoreboardUpdate(Guid gameId, List<PlayerStateDto> scoreboard)
    {
        return _hub.Clients.Group(gameId.ToString())
            .SendAsync(WsEvents.UpdateScoreboard, scoreboard);
    }
}