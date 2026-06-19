using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.CampaniasMontanera.Queries;

public record GetCampaniaMontaneraQuery(Guid Id) : IRequest<CampaniaMontanera?>;
public record GetCampaniasMontaneraQuery(Guid? FincaId = null, int Page = 1, int PageSize = 50) : IRequest<PagedList<CampaniaMontanera>>;

public class GetCampaniaMontaneraQueryHandler : IRequestHandler<GetCampaniaMontaneraQuery, CampaniaMontanera?>
{
    private readonly IApplicationDbContext _context;

    public GetCampaniaMontaneraQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CampaniaMontanera?> Handle(GetCampaniaMontaneraQuery request, CancellationToken cancellationToken)
    {
        return await _context.CampaniasMontanera
            .Include(c => c.Finca)
            .FirstOrDefaultAsync(c => c.Id == request.Id && c.DeletedAt == null, cancellationToken);
    }
}

public class GetCampaniasMontaneraQueryHandler : IRequestHandler<GetCampaniasMontaneraQuery, PagedList<CampaniaMontanera>>
{
    private readonly IApplicationDbContext _context;

    public GetCampaniasMontaneraQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<CampaniaMontanera>> Handle(GetCampaniasMontaneraQuery request, CancellationToken cancellationToken)
    {
        var query = _context.CampaniasMontanera
            .Include(c => c.Finca)
            .Where(c => c.DeletedAt == null);

        if (request.FincaId.HasValue)
            query = query.Where(c => c.FincaId == request.FincaId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<CampaniaMontanera>(items, totalCount, request.Page, request.PageSize);
    }
}
