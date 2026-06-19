using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Veterinarios.Commands;

public record CreateVeterinarioCommand(
    string NombreCompleto,
    string NumColegiado,
    string? Telefono,
    string? Email
) : IRequest<Guid>;

public class CreateVeterinarioCommandHandler : IRequestHandler<CreateVeterinarioCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateVeterinarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateVeterinarioCommand request, CancellationToken cancellationToken)
    {
        var veterinario = new Veterinario
        {
            NombreCompleto = request.NombreCompleto,
            NumColegiado = request.NumColegiado,
            Telefono = request.Telefono,
            Email = request.Email
        };

        _context.Veterinarios.Add(veterinario);
        await _context.SaveChangesAsync(cancellationToken);

        return veterinario.Id;
    }
}
