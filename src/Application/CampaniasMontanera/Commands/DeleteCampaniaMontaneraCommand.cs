using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.CampaniasMontanera.Commands;

public record DeleteCampaniaMontaneraCommand(Guid Id) : IRequest;

public class DeleteCampaniaMontaneraCommandHandler : IRequestHandler<DeleteCampaniaMontaneraCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCampaniaMontaneraCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCampaniaMontaneraCommand request, CancellationToken cancellationToken)
    {
        var campania = await _context.CampaniasMontanera.FindAsync(new object[] { request.Id }, cancellationToken);

        if (campania is null)
            throw new KeyNotFoundException($"CampaniaMontanera {request.Id} no encontrada");

        campania.DeletedAt = DateTime.UtcNow;
        campania.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
