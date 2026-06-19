using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Animals.Commands;

public record DeleteAnimalCommand(Guid Id) : IRequest;

public class DeleteAnimalCommandHandler : IRequestHandler<DeleteAnimalCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteAnimalCommand request, CancellationToken cancellationToken)
    {
        var animal = await _context.Animales.FindAsync(new object[] { request.Id }, cancellationToken);

        if (animal is null)
            throw new KeyNotFoundException($"Animal {request.Id} no encontrado");

        animal.DeletedAt = DateTime.UtcNow;
        animal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
