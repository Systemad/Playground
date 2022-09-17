using System.Security.Claims;
using API.Features.Player;
using API.Features.Quiz;
using API.Features.Quiz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Orleans;

namespace API.Features.SignalR;

[Authorize]
public class GlobalHub : Hub
{
    private readonly IGrainFactory _factory;
    private Guid GetUserId => new(Context.User.Claims.Single(e => e.Type == ClaimTypes.NameIdentifier).Value);
    private string GetUsername => new(Context.User.Identity.Name); // For username retrieval

    public GlobalHub(IGrainFactory factory)
    {
        _factory = factory;
    }

    public override async Task OnConnectedAsync()
    {
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.SetUsername(GetUsername);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.RemoveActiveGame();
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string gameId, string content)
    {
        var message = new Message(GetUserId.ToString(), GetUsername, content);
        await Clients.Group(gameId).SendAsync("ReceiveMessage", message);
    }

    public async Task JoinGame(string gameId)
    {
        await Groups.AddToGroupAsync(GetUserId.ToString(), gameId);
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.AddPlayer(GetUserId);
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.SetActiveGame(Guid.Parse(gameId));
    }

    public async Task LeaveGame(string gameId)
    {
        await Groups.RemoveFromGroupAsync(GetUserId.ToString(), gameId);
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.RemovePlayer(GetUserId);
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.RemoveActiveGame();
    }

    public async Task SubmitAnswer(AnswerModel answerModel)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(answerModel.GameId);
        await gameGrain.SubmitAnswer(GetUserId, answerModel.Answer);
    }

    public async Task SetPlayerStatus(Guid gameId, bool status)
    {
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(gameId);
        await gameGrain.SetPlayerStatus(GetUserId, status);
    }
}