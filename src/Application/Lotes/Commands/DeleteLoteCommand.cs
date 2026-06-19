using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Lotes.Commands;

public record DeleteLoteCommand(Guid Id) : IRequest;

public class DeleteLoteCommandHandler : IRequestHandler<DeleteLoteCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteLoteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteLoteCommand request, CancellationToken cancellationToken)
    {
        var lote = await _context.Lotes.FindAsync(new object[] { request.Id }, cancellationToken);

        if (lote is null)
            throw new KeyNotFoundException($"Lote {request.Id} no encontrado");

        lote.DeletedAt = DateTime.UtcNow;
        lote.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
