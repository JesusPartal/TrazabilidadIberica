using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrazabilidadIberica.Application.Auth.Commands;

namespace TrazabilidadIberica.Infrastructure.Identity;

public interface IIdentityService
{
    Task<AuthResult> RegisterAsync(string email, string password, string nombre, string nif, string rega, string role);
    Task<AuthResult> LoginAsync(string email, string password);
}

public class IdentityService : IIdentityService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public IdentityService(
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, string nombre, string nif, string rega, string role)
    {
        var user = new IdentityUser
        {
            UserName = email,
            Email = email
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            return new AuthResult(false, null, null, null, result.Errors.Select(e => e.Description).ToArray());

        if (!await _roleManager.RoleExistsAsync(role))
            await _roleManager.CreateAsync(new IdentityRole(role));

        await _userManager.AddToRoleAsync(user, role);

        var token = GenerateJwtToken(user, role);
        var refreshToken = GenerateRefreshToken();

        return new AuthResult(true, token, refreshToken, user.Id, null);
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null || !await _userManager.CheckPasswordAsync(user, password))
            return new AuthResult(false, null, null, null, new[] { "Credenciales inválidas" });

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Ganadero";

        var token = GenerateJwtToken(user, role);
        var refreshToken = GenerateRefreshToken();

        return new AuthResult(true, token, refreshToken, user.Id, null);
    }

    private string GenerateJwtToken(IdentityUser user, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? "DefaultSuperSecretKeyForDevelopment123456789!"));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "TrazabilidadIberica",
            audience: _configuration["Jwt:Audience"] ?? "TrazabilidadIberica",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var bytes = new byte[32];
        Guid.NewGuid().ToByteArray().CopyTo(bytes, 0);
        Guid.NewGuid().ToByteArray().CopyTo(bytes, 16);
        return Convert.ToBase64String(bytes);
    }
}
