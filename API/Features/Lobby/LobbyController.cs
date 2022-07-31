using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Orleans;

namespace API.Features.Lobby;

[Authorize]
[RequiredScope("API.Access")]
[Route("api/v{version:apiVersion}/lobby")]
[ApiController]
[ApiVersion("1.0")]
public class LobbyController : ControllerBase
{
    private readonly IGrainFactory _factory;

    private Guid GetUserId => new(User.Claims.Single(e => e.Type == ClaimTypes.NameIdentifier).Value);
    
    public LobbyController(IGrainFactory factory) => _factory = factory;

    [HttpGet("games", Name = "Get Games")]
    [ProducesResponseType(typeof(IEnumerable<GameSummary>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetGames()
    {
        var lobbyGrain = _factory.GetGrain<ILobbyGrain>(0);
        var lobbies = await lobbyGrain.GetGames();
        return Ok(lobbies);
    }
}