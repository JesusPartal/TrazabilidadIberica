using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.CampaniasMontanera.Commands;

public record UpdateCampaniaMontaneraCommand(
    Guid Id,
    Guid FincaId,
    int Temporada,
    DateTime FechaInicio,
    DateTime? FechaFin,
    decimal HectareasUtilizadas,
    int CapacidadMaxAnimales,
    EstadoCampania EstadoCampania,
    string? NumAutorizacionDO
) : IRequest;

public class UpdateCampaniaMontaneraCommandHandler : IRequestHandler<UpdateCampaniaMontaneraCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCampaniaMontaneraCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCampaniaMontaneraCommand request, CancellationToken cancellationToken)
    {
        var campania = await _context.CampaniasMontanera.FindAsync(new object[] { request.Id }, cancellationToken);

        if (campania is null)
            throw new KeyNotFoundException($"CampaniaMontanera {request.Id} no encontrada");

        campania.FincaId = request.FincaId;
        campania.Temporada = request.Temporada;
        campania.FechaInicio = request.FechaInicio;
        campania.FechaFin = request.FechaFin;
        campania.HectareasUtilizadas = request.HectareasUtilizadas;
        campania.CapacidadMaxAnimales = request.CapacidadMaxAnimales;
        campania.EstadoCampania = request.EstadoCampania;
        campania.NumAutorizacionDO = request.NumAutorizacionDO;
        campania.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
