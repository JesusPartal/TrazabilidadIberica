using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Ganaderos.Commands;

public record CreateGanaderoCommand(
    string NombreRazonSocial,
    string NIF,
    string REGA,
    string? Telefono,
    string? Email,
    string? DireccionCompleta
) : IRequest<Guid>;

public class CreateGanaderoCommandHandler : IRequestHandler<CreateGanaderoCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateGanaderoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateGanaderoCommand request, CancellationToken cancellationToken)
    {
        var ganadero = new Ganadero
        {
            NombreRazonSocial = request.NombreRazonSocial,
            NIF = request.NIF,
            REGA = request.REGA,
            Telefono = request.Telefono,
            Email = request.Email,
            DireccionCompleta = request.DireccionCompleta
        };

        _context.Ganaderos.Add(ganadero);
        await _context.SaveChangesAsync(cancellationToken);

        return ganadero.Id;
    }
}
