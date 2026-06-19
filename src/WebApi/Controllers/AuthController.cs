using Microsoft.AspNetCore.Mvc;
using TrazabilidadIberica.Application.Auth.Commands;
using TrazabilidadIberica.Infrastructure.Identity;

namespace TrazabilidadIberica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public AuthController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await _identityService.RegisterAsync(
            command.Email,
            command.Password,
            command.NombreRazonSocial,
            command.NIF,
            command.REGA,
            command.Role);

        if (!result.Success)
            return BadRequest(new { errors = result.Errors });

        return Ok(new { token = result.Token, refreshToken = result.RefreshToken, userId = result.UserId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _identityService.LoginAsync(command.Email, command.Password);

        if (!result.Success)
            return Unauthorized(new { errors = result.Errors });

        return Ok(new { token = result.Token, refreshToken = result.RefreshToken, userId = result.UserId });
    }
}
