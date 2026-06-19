using MediatR;

namespace TrazabilidadIberica.Application.Auth.Commands;

public record RegisterCommand(
    string Email,
    string Password,
    string NombreRazonSocial,
    string NIF,
    string REGA,
    string Role
) : IRequest<AuthResult>;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResult>;

public record AuthResult(
    bool Success,
    string? Token,
    string? RefreshToken,
    string? UserId,
    string[]? Errors
);
