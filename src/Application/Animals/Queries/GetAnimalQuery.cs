using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Animals.Queries;

public record GetAnimalQuery(Guid Id) : IRequest<Animal?>;
public record GetAnimalsQuery : IRequest<List<Animal>>;

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

public class GetAnimalsQueryHandler : IRequestHandler<GetAnimalsQuery, List<Animal>>
{
    private readonly IApplicationDbContext _context;

    public GetAnimalsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Animal>> Handle(GetAnimalsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Animales
            .Include(a => a.FincaActual)
            .Include(a => a.LoteActual)
            .Where(a => a.DeletedAt == null)
            .ToListAsync(cancellationToken);
    }
}
