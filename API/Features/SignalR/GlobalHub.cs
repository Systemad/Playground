using System.Security.Claims;
using API.Features.Quiz;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Orleans;

namespace API.Features.SignalR;

[Authorize]
public class GlobalHub : Hub
{
    private readonly IGrainFactory _factory;
    private Guid GetUserId => new(Context.User.Claims.Single(e => e.Type == ClaimTypes.NameIdentifier).Value);
    
    public GlobalHub(IGrainFactory factory)
    {
        _factory = factory;
    }
    
    public async Task JoinGame(Guid gameId)
    {
        await Groups.AddToGroupAsync(GetUserId.ToString(), gameId.ToString());
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(gameId);
        await gameGrain.AddPlayer(GetUserId);
    } 
    
    public async Task LeaveGame(Guid gameId)
    {
        await Groups.RemoveFromGroupAsync(GetUserId.ToString(), gameId.ToString());
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(gameId);
        await gameGrain.RemovePlayer(GetUserId);
    }

    public async Task SubmitAnswer(AnswerModel answerModel)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(answerModel.GameId);
        await gameGrain.SubmitAnswer(GetUserId, answerModel.Answer);
    }
    // TODO: Figure out separate hubs or separate classes with separate functions for each feature
}