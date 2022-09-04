using System.Net;
using System.Security.Claims;
using API.Features.Quiz.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Orleans;

namespace API.Features.Quiz;

[Authorize]
[RequiredScope("API.Access")]
[Route("api/v{version:apiVersion}/quiz")]
[ApiController]
[ApiVersion("1.0")]
public class QuizController : ControllerBase
{
    private readonly IGrainFactory _factory;

    private Guid GetUserId => new(User.Claims.Single(e => e.Type == ClaimTypes.NameIdentifier).Value);
    
    public QuizController(IGrainFactory factory) => _factory = factory;

    [HttpPost("create", Name = "Create game")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> CreateGame([FromBody] QuizSettingsModel settings)
    {
        var gameGuid = Guid.NewGuid();
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameGuid);
        await gameGrain.CreateGame(GetUserId, settings);
        return Ok(gameGuid);
    }

    [HttpPost("id:guid/start", Name = "Start Game")]
    [ProducesResponseType(typeof(GameState), (int)HttpStatusCode.OK)]
    public async Task<ActionResult> StartGame(Guid gameId)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameId);
        var game = await gameGrain.StartGame(GetUserId);
        return Ok(game);
    }

    [HttpPost("id:guid/settings", Name = "Set Game settings")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<ActionResult> SetGameSettings(Guid gameId, [FromBody] QuizSettingsModel settings)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameId);
        await gameGrain.SetGameSettings(settings);
        return Ok();
    }
    
    [HttpGet("id:guid/settings", Name = "Get Game settings")]
    [ProducesResponseType(typeof(QuizSettingState), (int)HttpStatusCode.OK)]
    public async Task<ActionResult> GetGameSettings(Guid gameId)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameId);
        var gameSettings = await gameGrain.GetGameSettings();
        return Ok(gameSettings);
    }
    
    [HttpGet("id:guid/runtime", Name = "Get Game runtime")]
    [ProducesResponseType(typeof(QuizRuntime), (int)HttpStatusCode.OK)]
    public async Task<ActionResult> GetGameRuntime(Guid gameId)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameId);
        var gameSettings = await gameGrain.GetGameSummary();
        return Ok(gameSettings);
    }
    
    [HttpGet("id:guid/score", Name = "Get Game scoreboard")]
    [ProducesResponseType(typeof(IEnumerable<PlayerRuntime>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult> GetGameScoreboard(Guid gameId)
    {
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameId);
        var scoreboard = await gameGrain.GetGameScoreboard();
        var scores = scoreboard.Values;
        return Ok(scores);
    }
}