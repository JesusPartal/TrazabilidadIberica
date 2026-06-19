using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Fincas.Queries;

public record GetFincaQuery(Guid Id) : IRequest<Finca?>;
public record GetFincasQuery(Guid? GanaderoId = null, int Page = 1, int PageSize = 50) : IRequest<PagedList<Finca>>;

public class GetFincaQueryHandler : IRequestHandler<GetFincaQuery, Finca?>
{
    private readonly IApplicationDbContext _context;

    public GetFincaQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Finca?> Handle(GetFincaQuery request, CancellationToken cancellationToken)
    {
        return await _context.Fincas
            .Include(f => f.Ganadero)
            .FirstOrDefaultAsync(f => f.Id == request.Id && f.DeletedAt == null, cancellationToken);
    }
}

public class GetFincasQueryHandler : IRequestHandler<GetFincasQuery, PagedList<Finca>>
{
    private readonly IApplicationDbContext _context;

    public GetFincasQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Finca>> Handle(GetFincasQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Fincas
            .Include(f => f.Ganadero)
            .Where(f => f.DeletedAt == null);

        if (request.GanaderoId.HasValue)
            query = query.Where(f => f.GanaderoId == request.GanaderoId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<Finca>(items, totalCount, request.Page, request.PageSize);
    }
}
