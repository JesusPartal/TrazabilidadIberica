using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Lotes.Commands;

public record UpdateLoteCommand(
    Guid Id,
    Guid FincaId,
    string CodigoLote,
    DateTime FechaFormacion,
    CategoriaLote Categoria,
    int NumeroAnimales,
    decimal PesoMedioKg,
    string ComposicionRacial,
    string? Origen,
    bool Cerrado
) : IRequest;

public class UpdateLoteCommandHandler : IRequestHandler<UpdateLoteCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateLoteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateLoteCommand request, CancellationToken cancellationToken)
    {
        var lote = await _context.Lotes.FindAsync(new object[] { request.Id }, cancellationToken);

        if (lote is null)
            throw new KeyNotFoundException($"Lote {request.Id} no encontrado");

        lote.FincaId = request.FincaId;
        lote.CodigoLote = request.CodigoLote;
        lote.FechaFormacion = request.FechaFormacion;
        lote.Categoria = request.Categoria;
        lote.NumeroAnimales = request.NumeroAnimales;
        lote.PesoMedioKg = request.PesoMedioKg;
        lote.ComposicionRacial = request.ComposicionRacial;
        lote.Origen = request.Origen;
        lote.Cerrado = request.Cerrado;
        lote.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
