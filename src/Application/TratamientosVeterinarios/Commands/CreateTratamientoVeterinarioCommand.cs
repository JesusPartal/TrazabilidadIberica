using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.TratamientosVeterinarios.Commands;

public record CreateTratamientoVeterinarioCommand(
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
) : IRequest<Guid>;

public class CreateTratamientoVeterinarioCommandHandler : IRequestHandler<CreateTratamientoVeterinarioCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateTratamientoVeterinarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTratamientoVeterinarioCommand request, CancellationToken cancellationToken)
    {
        var tratamiento = new TratamientoVeterinario
        {
            AnimalId = request.AnimalId,
            VeterinarioId = request.VeterinarioId,
            NombreMedicamento = request.NombreMedicamento,
            NumeroLote = request.NumeroLote,
            FechaAdministracion = request.FechaAdministracion,
            FechaCaducidad = request.FechaCaducidad,
            DosisAdministrada = request.DosisAdministrada,
            UnidadDosis = request.UnidadDosis,
            ViaAdministracion = request.ViaAdministracion,
            PeriodoSupresionDias = request.PeriodoSupresionDias,
            FechaFinSupresion = request.FechaFinSupresion
        };

        _context.TratamientosVeterinarios.Add(tratamiento);
        await _context.SaveChangesAsync(cancellationToken);

        return tratamiento.Id;
    }
}
