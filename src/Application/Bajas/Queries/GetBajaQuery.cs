using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Bajas.Queries;

public record GetBajaQuery(Guid Id) : IRequest<Baja?>;
public record GetBajasQuery(Guid? AnimalId = null, int Page = 1, int PageSize = 50) : IRequest<PagedList<Baja>>;

public class GetBajaQueryHandler : IRequestHandler<GetBajaQuery, Baja?>
{
    private readonly IApplicationDbContext _context;

    public GetBajaQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Baja?> Handle(GetBajaQuery request, CancellationToken cancellationToken)
    {
        return await _context.Bajas
            .Include(b => b.Animal)
            .FirstOrDefaultAsync(b => b.Id == request.Id && b.DeletedAt == null, cancellationToken);
    }
}

public class GetBajasQueryHandler : IRequestHandler<GetBajasQuery, PagedList<Baja>>
{
    private readonly IApplicationDbContext _context;

    public GetBajasQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Baja>> Handle(GetBajasQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bajas
            .Include(b => b.Animal)
            .Where(b => b.DeletedAt == null);

        if (request.AnimalId.HasValue)
            query = query.Where(b => b.AnimalId == request.AnimalId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<Baja>(items, totalCount, request.Page, request.PageSize);
    }
}
