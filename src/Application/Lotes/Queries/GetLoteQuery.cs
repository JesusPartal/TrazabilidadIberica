using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Lotes.Queries;

public record GetLoteQuery(Guid Id) : IRequest<Lote?>;
public record GetLotesQuery(Guid? FincaId = null, int Page = 1, int PageSize = 50) : IRequest<PagedList<Lote>>;

public class GetLoteQueryHandler : IRequestHandler<GetLoteQuery, Lote?>
{
    private readonly IApplicationDbContext _context;

    public GetLoteQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Lote?> Handle(GetLoteQuery request, CancellationToken cancellationToken)
    {
        return await _context.Lotes
            .Include(l => l.Finca)
            .FirstOrDefaultAsync(l => l.Id == request.Id && l.DeletedAt == null, cancellationToken);
    }
}

public class GetLotesQueryHandler : IRequestHandler<GetLotesQuery, PagedList<Lote>>
{
    private readonly IApplicationDbContext _context;

    public GetLotesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Lote>> Handle(GetLotesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Lotes
            .Include(l => l.Finca)
            .Where(l => l.DeletedAt == null);

        if (request.FincaId.HasValue)
            query = query.Where(l => l.FincaId == request.FincaId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<Lote>(items, totalCount, request.Page, request.PageSize);
    }
}
