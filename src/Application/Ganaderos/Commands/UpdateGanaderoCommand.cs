using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Ganaderos.Commands;

public record UpdateGanaderoCommand(
    Guid Id,
    string NombreRazonSocial,
    string NIF,
    string REGA,
    string? Telefono,
    string? Email,
    string? DireccionCompleta
) : IRequest;

public class UpdateGanaderoCommandHandler : IRequestHandler<UpdateGanaderoCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateGanaderoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateGanaderoCommand request, CancellationToken cancellationToken)
    {
        var ganadero = await _context.Ganaderos.FindAsync(new object[] { request.Id }, cancellationToken);

        if (ganadero is null)
            throw new KeyNotFoundException($"Ganadero {request.Id} no encontrado");

        ganadero.NombreRazonSocial = request.NombreRazonSocial;
        ganadero.NIF = request.NIF;
        ganadero.REGA = request.REGA;
        ganadero.Telefono = request.Telefono;
        ganadero.Email = request.Email;
        ganadero.DireccionCompleta = request.DireccionCompleta;
        ganadero.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
