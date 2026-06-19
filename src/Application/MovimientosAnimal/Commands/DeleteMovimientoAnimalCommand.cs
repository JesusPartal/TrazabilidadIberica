using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.MovimientosAnimal.Commands;

public record DeleteMovimientoAnimalCommand(Guid Id) : IRequest;

public class DeleteMovimientoAnimalCommandHandler : IRequestHandler<DeleteMovimientoAnimalCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteMovimientoAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteMovimientoAnimalCommand request, CancellationToken cancellationToken)
    {
        var movimiento = await _context.MovimientosAnimal.FindAsync(new object[] { request.Id }, cancellationToken);

        if (movimiento is null)
            throw new KeyNotFoundException($"MovimientoAnimal {request.Id} no encontrado");

        movimiento.DeletedAt = DateTime.UtcNow;
        movimiento.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
