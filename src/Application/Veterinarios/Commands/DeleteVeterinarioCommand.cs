using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.Veterinarios.Commands;

public record DeleteVeterinarioCommand(Guid Id) : IRequest;

public class DeleteVeterinarioCommandHandler : IRequestHandler<DeleteVeterinarioCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteVeterinarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteVeterinarioCommand request, CancellationToken cancellationToken)
    {
        var veterinario = await _context.Veterinarios.FindAsync(new object[] { request.Id }, cancellationToken);

        if (veterinario is null)
            throw new KeyNotFoundException($"Veterinario {request.Id} no encontrado");

        veterinario.DeletedAt = DateTime.UtcNow;
        veterinario.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
