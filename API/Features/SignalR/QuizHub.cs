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

[Authorize]
public class QuizHub : Hub
{
    private readonly IGrainFactory _factory;
    private Guid GetUserId => new(Context.User.Claims.Single(e => e.Type == ClaimTypes.NameIdentifier).Value);
    private string GetUsername => new(Context.User.Identity.Name); // For username retrieval
    private string GetConnectionId => new(Context.ConnectionId);

    public QuizHub(IGrainFactory factory)
    {
        _factory = factory;
    }

    public override async Task OnConnectedAsync()
    {
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        await player.SetUsername(GetUsername);
        await player.SetConnectionId(Context.ConnectionId);

        Console.WriteLine("connected " + Context.ConnectionId);
        //var lobbyGrain = _factory.GetGrain<ILobbyGrain>(0);
        //var lobbies = await lobbyGrain.GetGames();
        //await Clients.Caller.SendAsync("all-games", lobbies);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine("disconnected " + Context.ConnectionId);
        await CleanupPlayer();
    }

    public async Task SendMessage(string gameId, string content)
    {
        var message = new Message(GetUserId.ToString(), GetUsername, content);
        await Clients.Group(gameId).SendAsync("ReceiveMessage", message);
    }

    [HubMethodName("get-all-games")]
    public async Task GetGames()
    {
        var lobbyGrain = _factory.GetGrain<ILobbyGrain>(0);
        var games = await lobbyGrain.GetGames();

        Console.WriteLine("all games");
        await Clients.Caller.SendAsync(LobbyWsEvents.AllGames, games);
    }

    [HubMethodName("join-game")]
    public async Task JoinGame(string gameId)
    {
        try
        {
            // Fix order
            //await CleanupPlayer();
            //await Clients.Caller.SendAsync(WsEvents.NewGame, gameId); // Done in quizWorker
            await Groups.AddToGroupAsync(GetConnectionId, gameId);
            var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
            await gameGrain.AddPlayer(GetUserId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        Console.WriteLine($"Hub: Joining game {gameId}");
    }

    [HubMethodName("leave-game")]
    public async Task LeaveGame(string gameId)
    {
        Console.WriteLine($"Hub: Leaving game {gameId}");
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.RemovePlayer(GetUserId);
        //await CleanupPlayer();
        await Clients.Caller.SendAsync(WsEvents.GameReset); // Send this when game ends as well
    }

    [HubMethodName("start-game")]
    public async Task StartGame(string gameId)
    {
        Console.WriteLine($"Hub: Start game {gameId}");
        var gameGrain = _factory.GetGrain<IMultiplayerGrain>(Guid.Parse(gameId));
        await gameGrain.StartGame(GetUserId);
    }

    [HubMethodName("guess-answer")]
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

    // Cleanup player when disconnecting / joining another game
    private async Task CleanupPlayer()
    {
        Console.Write("Cleanup player " + GetUserId);
        var player = _factory.GetGrain<IPlayerGrain>(GetUserId);
        var pl = await player.GetActiveGame();
        await player.RemoveActiveGame();
        await player.ResetConnectionId();
        await Groups.RemoveFromGroupAsync(GetConnectionId, pl.ToString());
    }
}