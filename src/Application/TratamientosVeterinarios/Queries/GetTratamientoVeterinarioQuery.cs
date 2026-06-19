using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.TratamientosVeterinarios.Queries;

public record GetTratamientoVeterinarioQuery(Guid Id) : IRequest<TratamientoVeterinario?>;
public record GetTratamientosVeterinariosQuery(
    Guid? AnimalId = null,
    Guid? VeterinarioId = null,
    int Page = 1,
    int PageSize = 50
) : IRequest<PagedList<TratamientoVeterinario>>;

public class GetTratamientoVeterinarioQueryHandler : IRequestHandler<GetTratamientoVeterinarioQuery, TratamientoVeterinario?>
{
    private readonly IApplicationDbContext _context;

    public GetTratamientoVeterinarioQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TratamientoVeterinario?> Handle(GetTratamientoVeterinarioQuery request, CancellationToken cancellationToken)
    {
        return await _context.TratamientosVeterinarios
            .Include(t => t.Animal)
            .Include(t => t.Veterinario)
            .FirstOrDefaultAsync(t => t.Id == request.Id && t.DeletedAt == null, cancellationToken);
    }
}

public class GetTratamientosVeterinariosQueryHandler : IRequestHandler<GetTratamientosVeterinariosQuery, PagedList<TratamientoVeterinario>>
{
    private readonly IApplicationDbContext _context;

    public GetTratamientosVeterinariosQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<TratamientoVeterinario>> Handle(GetTratamientosVeterinariosQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TratamientosVeterinarios
            .Include(t => t.Animal)
            .Include(t => t.Veterinario)
            .Where(t => t.DeletedAt == null);

        if (request.AnimalId.HasValue)
            query = query.Where(t => t.AnimalId == request.AnimalId.Value);

        if (request.VeterinarioId.HasValue)
            query = query.Where(t => t.VeterinarioId == request.VeterinarioId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<TratamientoVeterinario>(items, totalCount, request.Page, request.PageSize);
    }
}
