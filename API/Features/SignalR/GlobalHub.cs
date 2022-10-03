using System.Security.Claims;
using API.Features.Lobby;
using API.Features.Player;
using API.Features.Quiz;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Orleans;

namespace API.Features.SignalR;

// TODO: Convert everything to SignalR
[Authorize]
public class GlobalHub : Hub
{
    private readonly IGrainFactory _factory;
    private Guid GetUserId => new(Context.User.Claims.Single(e => e.Type == ClaimTypes.NameIdentifier).Value);
    private string GetUsername => new(Context.User.Identity.Name); // For username retrieval
    private string GetConnectionId => new(Context.ConnectionId);

    public GlobalHub(IGrainFactory factory)
    {
        _factory = factory;
    }

    public override async Task OnConnectedAsync()
    {
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.SetUsername(GetUsername);
        await player.SetConnectionId(Context.ConnectionId);
        var lobbyGrain = _factory.GetGrain<ILobbyGrain>(0);
        var lobbies = await lobbyGrain.GetGames();
        await Clients.Caller.SendAsync("games", lobbies);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.RemoveActiveGame();
        await player.ResetConnectionId();
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string gameId, string content)
    {
        var message = new Message(GetUserId.ToString(), GetUsername, content);
        await Clients.Group(gameId).SendAsync("ReceiveMessage", message);
    }

    //[HubMethodName("join-game")]
    public async Task JoinGame(string gameId)
    {
        Console.WriteLine($"Hub: Joining game {gameId}");
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.AddPlayer(GetUserId, GetUsername);
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.SetActiveGame(Guid.Parse(gameId));
        await Groups.AddToGroupAsync(GetConnectionId, gameId);
    }

    //[HubMethodName("leave-game")]
    public async Task LeaveGame(string gameId)
    {
        Console.WriteLine($"Hub: Leaving game {gameId}");
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.RemovePlayer(GetUserId);
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.RemoveActiveGame();
        await Groups.RemoveFromGroupAsync(GetConnectionId, gameId);
    }

    public async Task StartGame(string gameId)
    {
        Console.WriteLine($"Hub: Start game {gameId}");
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.StartGame(GetUserId);
    }

    [HubMethodName("guess")]
    public async Task SubmitAnswer(string answer, string gameId)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(Guid.Parse(gameId));
        await gameGrain.SubmitAnswer(GetUserId, answer);
    }

    public async Task SetPlayerStatus(Guid gameId, bool status)
    {
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(gameId);
        await gameGrain.SetPlayerStatus(GetUserId, status);
    }

    public async Task GetLobbies()
    {
        var lobbyGrain = _factory.GetGrain<ILobbyGrain>(0);
        var lobbies = await lobbyGrain.GetGames();
    }
}