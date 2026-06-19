using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.TratamientosVeterinarios.Commands;

public record UpdateTratamientoVeterinarioCommand(
    Guid Id,
    Guid AnimalId,
    Guid VeterinarioId,
    string NombreMedicamento,
    string? NumeroLote,
    DateTime FechaAdministracion,
    DateTime? FechaCaducidad,
    decimal DosisAdministrada,
    string? UnidadDosis,
    string? ViaAdministracion,
    int PeriodoSupresionDias,
    DateTime FechaFinSupresion
) : IRequest;

public class UpdateTratamientoVeterinarioCommandHandler : IRequestHandler<UpdateTratamientoVeterinarioCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateTratamientoVeterinarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateTratamientoVeterinarioCommand request, CancellationToken cancellationToken)
    {
        var tratamiento = await _context.TratamientosVeterinarios.FindAsync(new object[] { request.Id }, cancellationToken);

        if (tratamiento is null)
            throw new KeyNotFoundException($"TratamientoVeterinario {request.Id} no encontrado");

        tratamiento.AnimalId = request.AnimalId;
        tratamiento.VeterinarioId = request.VeterinarioId;
        tratamiento.NombreMedicamento = request.NombreMedicamento;
        tratamiento.NumeroLote = request.NumeroLote;
        tratamiento.FechaAdministracion = request.FechaAdministracion;
        tratamiento.FechaCaducidad = request.FechaCaducidad;
        tratamiento.DosisAdministrada = request.DosisAdministrada;
        tratamiento.UnidadDosis = request.UnidadDosis;
        tratamiento.ViaAdministracion = request.ViaAdministracion;
        tratamiento.PeriodoSupresionDias = request.PeriodoSupresionDias;
        tratamiento.FechaFinSupresion = request.FechaFinSupresion;
        tratamiento.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
