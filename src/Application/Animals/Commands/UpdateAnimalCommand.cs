using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Animals.Commands;

public record UpdateAnimalCommand(
    Guid Id,
    string NumeroCrotal,
    string RazaIberica,
    int PorcentajeIberico,
    DateTime FechaNacimiento,
    string? Sexo,
    decimal PesoNacimientoKg,
    Guid FincaActualId,
    Guid? LoteActualId,
    string? OrigenAnimal
) : IRequest;

public class UpdateAnimalCommandHandler : IRequestHandler<UpdateAnimalCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateAnimalCommand request, CancellationToken cancellationToken)
    {
        var animal = await _context.Animales.FindAsync(new object[] { request.Id }, cancellationToken);

        if (animal is null)
            throw new KeyNotFoundException($"Animal {request.Id} no encontrado");

        animal.NumeroCrotal = request.NumeroCrotal;
        animal.RazaIberica = request.RazaIberica;
        animal.PorcentajeIberico = request.PorcentajeIberico;
        animal.FechaNacimiento = request.FechaNacimiento;
        animal.Sexo = request.Sexo;
        animal.PesoNacimientoKg = request.PesoNacimientoKg;
        animal.FincaActualId = request.FincaActualId;
        animal.LoteActualId = request.LoteActualId;
        animal.OrigenAnimal = request.OrigenAnimal;
        animal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
