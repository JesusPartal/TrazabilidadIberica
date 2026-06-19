using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Fincas.Commands;

public record DeleteFincaCommand(Guid Id) : IRequest;

public class DeleteFincaCommandHandler : IRequestHandler<DeleteFincaCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteFincaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteFincaCommand request, CancellationToken cancellationToken)
    {
        var finca = await _context.Fincas.FindAsync(new object[] { request.Id }, cancellationToken);
        if (finca is null)
            throw new KeyNotFoundException($"Finca {request.Id} no encontrada");

        finca.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
