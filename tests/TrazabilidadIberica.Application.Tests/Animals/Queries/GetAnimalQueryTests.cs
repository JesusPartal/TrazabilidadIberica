using FluentAssertions;
using TrazabilidadIberica.Application.Animals.Queries;

namespace TrazabilidadIberica.Application.Tests.Animals.Queries;

public class GetAnimalQueryTests : TestBase
{
    [Fact]
    public async Task Handle_ShouldReturnAnimal_WhenExists()
    {
        var context = CreateContext("GetAnimalById_1");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        var animal = CreateAnimal(finca.Id);
        context.Animales.Add(animal);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new GetAnimalQueryHandler(context);
        var result = await handler.Handle(new GetAnimalQuery(animal.Id), CancellationToken.None);

        result.Should().NotBeNull();
        result!.Id.Should().Be(animal.Id);
        result.NumeroCrotal.Should().Be(animal.NumeroCrotal);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenDeleted()
    {
        var context = CreateContext("GetAnimalById_Deleted");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        var animal = CreateAnimal(finca.Id);
        animal.DeletedAt = DateTime.UtcNow;
        context.Animales.Add(animal);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new GetAnimalQueryHandler(context);
        var result = await handler.Handle(new GetAnimalQuery(animal.Id), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenNotFound()
    {
        var context = CreateContext("GetAnimalById_NotFound");
        var handler = new GetAnimalQueryHandler(context);

        var result = await handler.Handle(new GetAnimalQuery(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_List_ShouldReturnOnlyNonDeleted()
    {
        var context = CreateContext("GetAnimals_List");
        var finca = CreateFinca();
        context.Fincas.Add(finca);
        var active = CreateAnimal(finca.Id);
        var deleted = CreateAnimal(finca.Id);
        deleted.DeletedAt = DateTime.UtcNow;
        context.Animales.AddRange(active, deleted);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new GetAnimalsQueryHandler(context);
        var result = await handler.Handle(new GetAnimalsQuery(), CancellationToken.None);

        result.Items.Should().HaveCount(1);
        result.Items[0].Id.Should().Be(active.Id);
        result.TotalCount.Should().Be(1);
    }
}
