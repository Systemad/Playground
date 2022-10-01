using System.Net;
using System.Security.Claims;
using API.Features.Quiz.API;
using API.Features.Quiz.Dto;
using API.Features.Quiz.Interfaces;
using API.Features.Quiz.Models;
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

    public QuizController(IGrainFactory factory)
    {
        _factory = factory;
    }

    [HttpPost("create", Name = "Create game")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> CreateGame([FromBody] QuizCreationModel settings)
    {
        var gameGuid = Guid.NewGuid();
        var gameGrain = _factory.GetGrain<IQuizGrain>(gameGuid);
        await gameGrain.CreateGame(GetUserId, settings);
        return Ok(gameGuid);
    }
}