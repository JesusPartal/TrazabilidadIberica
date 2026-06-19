using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.MovimientosAnimal.Commands;

public record UpdateMovimientoAnimalCommand(
    Guid Id,
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
) : IRequest;

public class UpdateMovimientoAnimalCommandHandler : IRequestHandler<UpdateMovimientoAnimalCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateMovimientoAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateMovimientoAnimalCommand request, CancellationToken cancellationToken)
    {
        var movimiento = await _context.MovimientosAnimal.FindAsync(new object[] { request.Id }, cancellationToken);

        if (movimiento is null)
            throw new KeyNotFoundException($"MovimientoAnimal {request.Id} no encontrado");

        movimiento.AnimalId = request.AnimalId;
        movimiento.FincaOrigenId = request.FincaOrigenId;
        movimiento.FincaDestinoId = request.FincaDestinoId;
        movimiento.TipoMovimiento = request.TipoMovimiento;
        movimiento.FechaMovimiento = request.FechaMovimiento;
        movimiento.NumeroGuia = request.NumeroGuia;
        movimiento.Motivo = request.Motivo;
        movimiento.OperadorDestino = request.OperadorDestino;
        movimiento.NumDocumentoAcompanamiento = request.NumDocumentoAcompanamiento;
        movimiento.CSV = request.CSV;
        movimiento.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
