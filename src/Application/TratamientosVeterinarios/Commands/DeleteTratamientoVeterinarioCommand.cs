using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;

namespace TrazabilidadIberica.Application.TratamientosVeterinarios.Commands;

public record DeleteTratamientoVeterinarioCommand(Guid Id) : IRequest;

public class DeleteTratamientoVeterinarioCommandHandler : IRequestHandler<DeleteTratamientoVeterinarioCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteTratamientoVeterinarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTratamientoVeterinarioCommand request, CancellationToken cancellationToken)
    {
        var tratamiento = await _context.TratamientosVeterinarios.FindAsync(new object[] { request.Id }, cancellationToken);

        if (tratamiento is null)
            throw new KeyNotFoundException($"TratamientoVeterinario {request.Id} no encontrado");

        tratamiento.DeletedAt = DateTime.UtcNow;
        tratamiento.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
