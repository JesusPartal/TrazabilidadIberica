using MediatR;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Common.Models;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Veterinarios.Queries;

public record GetVeterinarioQuery(Guid Id) : IRequest<Veterinario?>;
public record GetVeterinariosQuery(int Page = 1, int PageSize = 50) : IRequest<PagedList<Veterinario>>;

public class GetVeterinarioQueryHandler : IRequestHandler<GetVeterinarioQuery, Veterinario?>
{
    private readonly IApplicationDbContext _context;

    public GetVeterinarioQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Veterinario?> Handle(GetVeterinarioQuery request, CancellationToken cancellationToken)
    {
        return await _context.Veterinarios
            .Include(v => v.Tratamientos)
            .FirstOrDefaultAsync(v => v.Id == request.Id && v.DeletedAt == null, cancellationToken);
    }
}

public class GetVeterinariosQueryHandler : IRequestHandler<GetVeterinariosQuery, PagedList<Veterinario>>
{
    private readonly IApplicationDbContext _context;

    public GetVeterinariosQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Veterinario>> Handle(GetVeterinariosQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Veterinarios
            .Include(v => v.Tratamientos)
            .Where(v => v.DeletedAt == null);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<Veterinario>(items, totalCount, request.Page, request.PageSize);
    }
}
