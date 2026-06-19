using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.CampaniasMontanera.Commands;

public record CreateCampaniaMontaneraCommand(
    Guid FincaId,
    int Temporada,
    DateTime FechaInicio,
    DateTime? FechaFin,
    decimal HectareasUtilizadas,
    int CapacidadMaxAnimales,
    string? NumAutorizacionDO
) : IRequest<Guid>;

public class CreateCampaniaMontaneraCommandHandler : IRequestHandler<CreateCampaniaMontaneraCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateCampaniaMontaneraCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCampaniaMontaneraCommand request, CancellationToken cancellationToken)
    {
        var campania = new CampaniaMontanera
        {
            FincaId = request.FincaId,
            Temporada = request.Temporada,
            FechaInicio = request.FechaInicio,
            FechaFin = request.FechaFin,
            HectareasUtilizadas = request.HectareasUtilizadas,
            CapacidadMaxAnimales = request.CapacidadMaxAnimales,
            NumAutorizacionDO = request.NumAutorizacionDO,
            EstadoCampania = EstadoCampania.Planificada
        };

        _context.CampaniasMontanera.Add(campania);
        await _context.SaveChangesAsync(cancellationToken);

        return campania.Id;
    }
}
