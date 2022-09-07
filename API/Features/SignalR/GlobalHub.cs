using System.Security.Claims;
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
    private string GetUsername => new(Context.User.Claims.Single(e => e.Type == ClaimTypes.Name).Value);
    
    public GlobalHub(IGrainFactory factory)
    {
        _factory = factory;
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
    } 
    
    public async Task LeaveGame(string gameId)
    {
        await Groups.RemoveFromGroupAsync(GetUserId.ToString(), gameId);
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.RemovePlayer(GetUserId);
    }

    public async Task SubmitAnswer(AnswerModel answerModel)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(answerModel.GameId);
        await gameGrain.SubmitAnswer(GetUserId, answerModel.Answer);
    }
    // TODO: Figure out separate hubs or separate classes with separate functions for each feature
}