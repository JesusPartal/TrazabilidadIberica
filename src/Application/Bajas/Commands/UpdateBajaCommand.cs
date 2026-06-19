using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Bajas.Commands;

public record UpdateBajaCommand(
    Guid Id,
    Guid AnimalId,
    DateTime FechaBaja,
    CausaBaja Causa,
    string? Destino,
    string? NumGuiaAsociada,
    string? Observaciones
) : IRequest;

public class UpdateBajaCommandHandler : IRequestHandler<UpdateBajaCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBajaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateBajaCommand request, CancellationToken cancellationToken)
    {
        var baja = await _context.Bajas.FindAsync(new object[] { request.Id }, cancellationToken);

        if (baja is null)
            throw new KeyNotFoundException($"Baja {request.Id} no encontrada");

        baja.AnimalId = request.AnimalId;
        baja.FechaBaja = request.FechaBaja;
        baja.Causa = request.Causa;
        baja.Destino = request.Destino;
        baja.NumGuiaAsociada = request.NumGuiaAsociada;
        baja.Observaciones = request.Observaciones;
        baja.UpdatedAt = DateTime.UtcNow;

        var animal = await _context.Animales.FindAsync(new object[] { request.AnimalId }, cancellationToken);

        if (animal is not null)
        {
            animal.EstadoActual = request.Causa switch
            {
                CausaBaja.Muerte => EstadoAnimal.Muerto,
                CausaBaja.Venta => EstadoAnimal.Vendido,
                CausaBaja.Sacrificio => EstadoAnimal.Sacrificado,
                CausaBaja.Perdida => EstadoAnimal.Perdido,
                _ => animal.EstadoActual
            };
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
