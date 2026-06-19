using TrazabilidadIberica.Application.Auth.Commands;

namespace TrazabilidadIberica.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<AuthResult> RegisterAsync(string email, string password, string nombreRazonSocial, string nif, string rega, CancellationToken cancellationToken);
    Task<AuthResult> LoginAsync(string email, string password);
}
