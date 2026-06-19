using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrazabilidadIberica.Application.Auth.Commands;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly IApplicationDbContext _context;
    private const string DefaultRole = "Ganadero";

    public IdentityService(
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        IApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _context = context;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, string nombreRazonSocial, string nif, string rega, CancellationToken cancellationToken)
    {
        var user = new IdentityUser
        {
            UserName = email,
            Email = email
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            return new AuthResult(false, null, null, null, null, null, result.Errors.Select(e => e.Description).ToArray());

        if (!await _roleManager.RoleExistsAsync(DefaultRole))
            await _roleManager.CreateAsync(new IdentityRole(DefaultRole));

        await _userManager.AddToRoleAsync(user, DefaultRole);

        var ganadero = new Ganadero
        {
            NombreRazonSocial = nombreRazonSocial,
            NIF = nif,
            REGA = rega,
            Email = email,
            IdentityUserId = user.Id
        };

        _context.Ganaderos.Add(ganadero);
        await _context.SaveChangesAsync(cancellationToken);

        var token = GenerateJwtToken(user, DefaultRole);
        var refreshToken = await SaveRefreshTokenAsync(user.Id, cancellationToken);

        return new AuthResult(true, token, refreshToken, user.Id, email, ganadero.Id.ToString(), null);
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null || !await _userManager.CheckPasswordAsync(user, password))
            return new AuthResult(false, null, null, null, null, null, new[] { "Credenciales inválidas" });

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? DefaultRole;

        var ganadero = await _context.Ganaderos
            .FirstOrDefaultAsync(g => g.IdentityUserId == user.Id);

        var token = GenerateJwtToken(user, role);
        var refreshToken = await SaveRefreshTokenAsync(user.Id, default);

        return new AuthResult(true, token, refreshToken, user.Id, user.Email, ganadero?.Id.ToString(), null);
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken is null || !storedToken.IsActive)
            return new AuthResult(false, null, null, null, null, null, new[] { "Token de refresco inválido o expirado" });

        storedToken.IsRevoked = true;
        storedToken.RevokedAt = DateTime.UtcNow;

        var user = await _userManager.FindByIdAsync(storedToken.IdentityUserId);
        if (user is null)
            return new AuthResult(false, null, null, null, null, null, new[] { "Usuario no encontrado" });

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? DefaultRole;
        var ganadero = await _context.Ganaderos
            .FirstOrDefaultAsync(g => g.IdentityUserId == user.Id);

        var newToken = GenerateJwtToken(user, role);
        var newRefreshToken = await SaveRefreshTokenAsync(user.Id, default);

        return new AuthResult(true, newToken, newRefreshToken, user.Id, user.Email, ganadero?.Id.ToString(), null);
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken is not null)
        {
            storedToken.IsRevoked = true;
            storedToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(default);
        }
    }

    private async Task<string> SaveRefreshTokenAsync(string userId, CancellationToken cancellationToken)
    {
        var token = new RefreshToken
        {
            Token = GenerateRefreshTokenValue(),
            IdentityUserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync(cancellationToken);

        return token.Token;
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

    private static string GenerateRefreshTokenValue()
    {
        var bytes = new byte[32];
        Guid.NewGuid().ToByteArray().CopyTo(bytes, 0);
        Guid.NewGuid().ToByteArray().CopyTo(bytes, 16);
        return Convert.ToBase64String(bytes);
    }
}
