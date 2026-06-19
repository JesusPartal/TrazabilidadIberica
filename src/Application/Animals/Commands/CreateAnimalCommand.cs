using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Animals.Commands;

public record CreateAnimalCommand(
    string NumeroCrotal,
    string RazaIberica,
    int PorcentajeIberico,
    DateTime FechaNacimiento,
    string? Sexo,
    decimal PesoNacimientoKg,
    Guid FincaActualId,
    Guid? LoteActualId,
    string? OrigenAnimal
) : IRequest<Guid>;

public class CreateAnimalCommandHandler : IRequestHandler<CreateAnimalCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateAnimalCommand request, CancellationToken cancellationToken)
    {
        var animal = new Animal
        {
            NumeroCrotal = request.NumeroCrotal,
            RazaIberica = request.RazaIberica,
            PorcentajeIberico = request.PorcentajeIberico,
            FechaNacimiento = request.FechaNacimiento,
            Sexo = request.Sexo,
            PesoNacimientoKg = request.PesoNacimientoKg,
            FincaActualId = request.FincaActualId,
            LoteActualId = request.LoteActualId,
            OrigenAnimal = request.OrigenAnimal,
            EstadoActual = Domain.Enums.EstadoAnimal.Activo
        };

        _context.Animales.Add(animal);
        await _context.SaveChangesAsync(cancellationToken);

        return animal.Id;
    }
}
