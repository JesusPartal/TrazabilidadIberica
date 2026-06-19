using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Auth.Commands;

public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, AuthResult>
{
    private readonly IIdentityService _identityService;

    public RevokeTokenCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResult> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        await _identityService.RevokeRefreshTokenAsync(request.RefreshToken);
        return new AuthResult(true, null, null, null, null, null, null);
    }
}
