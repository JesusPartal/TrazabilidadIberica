using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Fincas.Queries;

public record GetFincaQuery(Guid Id) : IRequest<Finca?>;
public record GetFincasQuery(Guid? GanaderoId = null) : IRequest<List<Finca>>;

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

public class GetFincasQueryHandler : IRequestHandler<GetFincasQuery, List<Finca>>
{
    private readonly IApplicationDbContext _context;

    public GetFincasQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Finca>> Handle(GetFincasQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Fincas
            .Include(f => f.Ganadero)
            .Where(f => f.DeletedAt == null);

        if (request.GanaderoId.HasValue)
            query = query.Where(f => f.GanaderoId == request.GanaderoId.Value);

        return await query.ToListAsync(cancellationToken);
    }
}
