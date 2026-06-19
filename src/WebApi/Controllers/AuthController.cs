using MediatR;
using Microsoft.AspNetCore.Mvc;
using TrazabilidadIberica.Application.Auth.Commands;

namespace TrazabilidadIberica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(new { errors = result.Errors });

        return Ok(new { token = result.Token, refreshToken = result.RefreshToken, userId = result.UserId, email = result.Email, ganaderoId = result.GanaderoId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
            return Unauthorized(new { errors = result.Errors });

        return Ok(new { token = result.Token, refreshToken = result.RefreshToken, userId = result.UserId, email = result.Email, ganaderoId = result.GanaderoId });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
            return Unauthorized(new { errors = result.Errors });

        return Ok(new { token = result.Token, refreshToken = result.RefreshToken, userId = result.UserId, email = result.Email, ganaderoId = result.GanaderoId });
    }

    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke([FromBody] RevokeTokenCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(new { errors = result.Errors });

        return Ok(new { message = "Token revocado" });
    }
}
