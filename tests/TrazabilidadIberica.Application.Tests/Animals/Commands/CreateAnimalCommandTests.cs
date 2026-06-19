using FluentAssertions;
using TrazabilidadIberica.Application.Animals.Commands;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Tests.Animals.Commands;

public class CreateAnimalCommandTests : TestBase
{
    [Fact]
    public async Task Handle_ShouldCreateAnimal_WithCorrectValues()
    {
        var context = CreateContext("CreateAnimal_1");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new CreateAnimalCommandHandler(context);
        var command = new CreateAnimalCommand(
            NumeroCrotal: "ES009876543210",
            RazaIberica: "Ibérico 100%",
            PorcentajeIberico: 100,
            FechaNacimiento: new DateTime(2024, 3, 10),
            Sexo: "Hembra",
            PesoNacimientoKg: 1.2m,
            FincaActualId: finca.Id,
            LoteActualId: null,
            OrigenAnimal: "Cría propia"
        );

        var animalId = await handler.Handle(command, CancellationToken.None);

        var animal = await context.Animales.FindAsync(animalId);
        animal.Should().NotBeNull();
        animal!.NumeroCrotal.Should().Be("ES009876543210");
        animal.RazaIberica.Should().Be("Ibérico 100%");
        animal.PorcentajeIberico.Should().Be(100);
        animal.FechaNacimiento.Should().Be(new DateTime(2024, 3, 10));
        animal.Sexo.Should().Be("Hembra");
        animal.PesoNacimientoKg.Should().Be(1.2m);
        animal.FincaActualId.Should().Be(finca.Id);
        animal.EstadoActual.Should().Be(EstadoAnimal.Activo);
        animal.OrigenAnimal.Should().Be("Cría propia");
    }

    [Fact]
    public async Task Handle_ShouldReturnNewGuid()
    {
        var context = CreateContext("CreateAnimal_2");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new CreateAnimalCommandHandler(context);
        var command = new CreateAnimalCommand(
            "ES001", "Ibérico", 75, DateTime.UtcNow, "Macho", 1.5m,
            finca.Id, null, null
        );

        var animalId = await handler.Handle(command, CancellationToken.None);

        animalId.Should().NotBeEmpty();
    }
}
