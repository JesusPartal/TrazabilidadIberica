using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Veterinarios.Commands;

public record UpdateVeterinarioCommand(
    Guid Id,
    string NombreCompleto,
    string NumColegiado,
    string? Telefono,
    string? Email
) : IRequest;

public class UpdateVeterinarioCommandHandler : IRequestHandler<UpdateVeterinarioCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateVeterinarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateVeterinarioCommand request, CancellationToken cancellationToken)
    {
        var veterinario = await _context.Veterinarios.FindAsync(new object[] { request.Id }, cancellationToken);

        if (veterinario is null)
            throw new KeyNotFoundException($"Veterinario {request.Id} no encontrado");

        veterinario.NombreCompleto = request.NombreCompleto;
        veterinario.NumColegiado = request.NumColegiado;
        veterinario.Telefono = request.Telefono;
        veterinario.Email = request.Email;
        veterinario.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
