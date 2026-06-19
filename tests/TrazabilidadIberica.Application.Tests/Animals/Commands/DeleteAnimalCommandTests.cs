using FluentAssertions;
using TrazabilidadIberica.Application.Animals.Commands;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Tests.Animals.Commands;

public class DeleteAnimalCommandTests : TestBase
{
    [Fact]
    public async Task Handle_ShouldSoftDeleteAnimal()
    {
        var context = CreateContext("DeleteAnimal_1");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        var animal = CreateAnimal(finca.Id);
        context.Animales.Add(animal);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new DeleteAnimalCommandHandler(context);
        await handler.Handle(new DeleteAnimalCommand(animal.Id), CancellationToken.None);

        var deleted = await context.Animales.FindAsync(animal.Id);
        deleted!.DeletedAt.Should().NotBeNull();
        deleted.EstadoActual.Should().Be(EstadoAnimal.Perdido);
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenAnimalNotFound()
    {
        var context = CreateContext("DeleteAnimal_NotFound");
        var handler = new DeleteAnimalCommandHandler(context);

        await FluentActions.Awaiting(() =>
            handler.Handle(new DeleteAnimalCommand(Guid.NewGuid()), CancellationToken.None))
            .Should().ThrowAsync<KeyNotFoundException>();
    }
}
