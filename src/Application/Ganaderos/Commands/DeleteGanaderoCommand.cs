using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Ganaderos.Commands;

public record DeleteGanaderoCommand(Guid Id) : IRequest;

public class DeleteGanaderoCommandHandler : IRequestHandler<DeleteGanaderoCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteGanaderoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteGanaderoCommand request, CancellationToken cancellationToken)
    {
        var ganadero = await _context.Ganaderos.FindAsync(new object[] { request.Id }, cancellationToken);

        if (ganadero is null)
            throw new KeyNotFoundException($"Ganadero {request.Id} no encontrado");

        ganadero.DeletedAt = DateTime.UtcNow;
        ganadero.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
