using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Ganaderos.Queries;

public record GetGanaderoQuery(Guid Id) : IRequest<Ganadero?>;
public record GetGanaderosQuery(int Page = 1, int PageSize = 50) : IRequest<PagedList<Ganadero>>;

public class GetGanaderoQueryHandler : IRequestHandler<GetGanaderoQuery, Ganadero?>
{
    private readonly IApplicationDbContext _context;

    public GetGanaderoQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Ganadero?> Handle(GetGanaderoQuery request, CancellationToken cancellationToken)
    {
        return await _context.Ganaderos
            .Include(g => g.Fincas)
            .FirstOrDefaultAsync(g => g.Id == request.Id && g.DeletedAt == null, cancellationToken);
    }
}

public class GetGanaderosQueryHandler : IRequestHandler<GetGanaderosQuery, PagedList<Ganadero>>
{
    private readonly IApplicationDbContext _context;

    public GetGanaderosQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Ganadero>> Handle(GetGanaderosQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Ganaderos
            .Include(g => g.Fincas)
            .Where(g => g.DeletedAt == null);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<Ganadero>(items, totalCount, request.Page, request.PageSize);
    }
}
