using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.MovimientosAnimal.Commands;

public record CreateMovimientoAnimalCommand(
    Guid AnimalId,
    Guid FincaOrigenId,
    Guid FincaDestinoId,
    TipoMovimiento TipoMovimiento,
    DateTime FechaMovimiento,
    string? NumeroGuia,
    string? Motivo,
    string? OperadorDestino,
    string? NumDocumentoAcompanamiento,
    string? CSV
) : IRequest<Guid>;

public class CreateMovimientoAnimalCommandHandler : IRequestHandler<CreateMovimientoAnimalCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateMovimientoAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateMovimientoAnimalCommand request, CancellationToken cancellationToken)
    {
        var movimiento = new MovimientoAnimal
        {
            AnimalId = request.AnimalId,
            FincaOrigenId = request.FincaOrigenId,
            FincaDestinoId = request.FincaDestinoId,
            TipoMovimiento = request.TipoMovimiento,
            FechaMovimiento = request.FechaMovimiento,
            NumeroGuia = request.NumeroGuia,
            Motivo = request.Motivo,
            OperadorDestino = request.OperadorDestino,
            NumDocumentoAcompanamiento = request.NumDocumentoAcompanamiento,
            CSV = request.CSV
        };

        _context.MovimientosAnimal.Add(movimiento);

        var animal = await _context.Animales.FirstOrDefaultAsync(
            a => a.Id == request.AnimalId && a.DeletedAt == null, cancellationToken);

        if (animal is not null)
            animal.FincaActualId = request.FincaDestinoId;

        await _context.SaveChangesAsync(cancellationToken);

        return movimiento.Id;
    }
}
