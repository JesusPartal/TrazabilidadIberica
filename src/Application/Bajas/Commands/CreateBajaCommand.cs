using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Bajas.Commands;

public record CreateBajaCommand(
    Guid AnimalId,
    DateTime FechaBaja,
    CausaBaja Causa,
    string? Destino,
    string? NumGuiaAsociada,
    string? Observaciones
) : IRequest<Guid>;

public class CreateBajaCommandHandler : IRequestHandler<CreateBajaCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateBajaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateBajaCommand request, CancellationToken cancellationToken)
    {
        var baja = new Baja
        {
            AnimalId = request.AnimalId,
            FechaBaja = request.FechaBaja,
            Causa = request.Causa,
            Destino = request.Destino,
            NumGuiaAsociada = request.NumGuiaAsociada,
            Observaciones = request.Observaciones
        };

        _context.Bajas.Add(baja);
        await _context.SaveChangesAsync(cancellationToken);

        return baja.Id;
    }
}
