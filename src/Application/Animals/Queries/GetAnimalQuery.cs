using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Animals.Queries;

public record GetAnimalQuery(Guid Id) : IRequest<Animal?>;
public record GetAnimalsQuery(int Page = 1, int PageSize = 50) : IRequest<PagedList<Animal>>;

public class GetAnimalQueryHandler : IRequestHandler<GetAnimalQuery, Animal?>
{
    private readonly IApplicationDbContext _context;

    public GetAnimalQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Animal?> Handle(GetAnimalQuery request, CancellationToken cancellationToken)
    {
        return await _context.Animales
            .Include(a => a.FincaActual)
            .Include(a => a.LoteActual)
            .FirstOrDefaultAsync(a => a.Id == request.Id && a.DeletedAt == null, cancellationToken);
    }
}

public class GetAnimalsQueryHandler : IRequestHandler<GetAnimalsQuery, PagedList<Animal>>
{
    private readonly IApplicationDbContext _context;

    public GetAnimalsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Animal>> Handle(GetAnimalsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Animales
            .Include(a => a.FincaActual)
            .Include(a => a.LoteActual)
            .Where(a => a.DeletedAt == null);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<Animal>(items, totalCount, request.Page, request.PageSize);
    }
}
