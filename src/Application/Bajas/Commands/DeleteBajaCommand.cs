using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Bajas.Commands;

public record DeleteBajaCommand(Guid Id) : IRequest;

public class DeleteBajaCommandHandler : IRequestHandler<DeleteBajaCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBajaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBajaCommand request, CancellationToken cancellationToken)
    {
        var baja = await _context.Bajas.FindAsync(new object[] { request.Id }, cancellationToken);

        if (baja is null)
            throw new KeyNotFoundException($"Baja {request.Id} no encontrada");

        baja.DeletedAt = DateTime.UtcNow;
        baja.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
