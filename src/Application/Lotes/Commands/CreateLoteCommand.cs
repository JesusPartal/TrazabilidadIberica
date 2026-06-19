using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Lotes.Commands;

public record CreateLoteCommand(
    Guid FincaId,
    string CodigoLote,
    DateTime FechaFormacion,
    CategoriaLote Categoria,
    int NumeroAnimales,
    decimal PesoMedioKg,
    string ComposicionRacial,
    string? Origen,
    bool Cerrado
) : IRequest<Guid>;

public class CreateLoteCommandHandler : IRequestHandler<CreateLoteCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateLoteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateLoteCommand request, CancellationToken cancellationToken)
    {
        var lote = new Lote
        {
            FincaId = request.FincaId,
            CodigoLote = request.CodigoLote,
            FechaFormacion = request.FechaFormacion,
            Categoria = request.Categoria,
            NumeroAnimales = request.NumeroAnimales,
            PesoMedioKg = request.PesoMedioKg,
            ComposicionRacial = request.ComposicionRacial,
            Origen = request.Origen,
            Cerrado = request.Cerrado
        };

        _context.Lotes.Add(lote);
        await _context.SaveChangesAsync(cancellationToken);

        return lote.Id;
    }
}
