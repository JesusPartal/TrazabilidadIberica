using FluentAssertions;
using TrazabilidadIberica.Application.Animals.Commands;

namespace TrazabilidadIberica.Application.Tests.Animals.Commands;

public class UpdateAnimalCommandTests : TestBase
{
    [Fact]
    public async Task Handle_ShouldUpdateAnimal_WhenExists()
    {
        var context = CreateContext("UpdateAnimal_1");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        var animal = CreateAnimal(finca.Id);
        context.Animales.Add(animal);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new UpdateAnimalCommandHandler(context);
        var command = new UpdateAnimalCommand(
            animal.Id, "ES999999999999", "Ibérico 75%", 75,
            new DateTime(2023, 6, 1), "Macho", 1.8m,
            finca.Id, null, "Compra externa"
        );

        await handler.Handle(command, CancellationToken.None);

        var updated = await context.Animales.FindAsync(animal.Id);
        updated!.NumeroCrotal.Should().Be("ES999999999999");
        updated.PorcentajeIberico.Should().Be(75);
        updated.OrigenAnimal.Should().Be("Compra externa");
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenAnimalNotFound()
    {
        var context = CreateContext("UpdateAnimal_NotFound");
        var handler = new UpdateAnimalCommandHandler(context);
        var command = new UpdateAnimalCommand(
            Guid.NewGuid(), "ES000", "Test", 50, DateTime.UtcNow,
            null, 1m, Guid.NewGuid(), null, null
        );

        await FluentActions.Awaiting(() => handler.Handle(command, CancellationToken.None))
            .Should().ThrowAsync<KeyNotFoundException>();
    }
}
