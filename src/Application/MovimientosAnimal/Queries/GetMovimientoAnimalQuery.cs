using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.MovimientosAnimal.Queries;

public record GetMovimientoAnimalQuery(Guid Id) : IRequest<MovimientoAnimal?>;
public record GetMovimientosAnimalQuery(Guid? AnimalId = null, Guid? FincaId = null, int Page = 1, int PageSize = 50) : IRequest<PagedList<MovimientoAnimal>>;

public class GetMovimientoAnimalQueryHandler : IRequestHandler<GetMovimientoAnimalQuery, MovimientoAnimal?>
{
    private readonly IApplicationDbContext _context;

    public GetMovimientoAnimalQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MovimientoAnimal?> Handle(GetMovimientoAnimalQuery request, CancellationToken cancellationToken)
    {
        return await _context.MovimientosAnimal
            .Include(m => m.Animal)
            .Include(m => m.FincaOrigen)
            .Include(m => m.FincaDestino)
            .FirstOrDefaultAsync(m => m.Id == request.Id && m.DeletedAt == null, cancellationToken);
    }
}

public class GetMovimientosAnimalQueryHandler : IRequestHandler<GetMovimientosAnimalQuery, PagedList<MovimientoAnimal>>
{
    private readonly IApplicationDbContext _context;

    public GetMovimientosAnimalQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<MovimientoAnimal>> Handle(GetMovimientosAnimalQuery request, CancellationToken cancellationToken)
    {
        var query = _context.MovimientosAnimal
            .Include(m => m.Animal)
            .Include(m => m.FincaOrigen)
            .Include(m => m.FincaDestino)
            .Where(m => m.DeletedAt == null);

        if (request.AnimalId.HasValue)
            query = query.Where(m => m.AnimalId == request.AnimalId.Value);

        if (request.FincaId.HasValue)
            query = query.Where(m => m.FincaOrigenId == request.FincaId.Value || m.FincaDestinoId == request.FincaId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<MovimientoAnimal>(items, totalCount, request.Page, request.PageSize);
    }
}
