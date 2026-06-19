using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResult>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.RegisterAsync(
            request.Email,
            request.Password,
            request.NombreRazonSocial,
            request.NIF,
            request.REGA,
            cancellationToken);
    }
}
