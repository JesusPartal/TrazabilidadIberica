using FluentAssertions;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Application.Fincas.Queries;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Tests.Fincas.Queries;

public class GetFincaQueryTests : TestBase
{
    private static Ganadero CreateGanadero()
    {
        return new Ganadero
        {
            Id = Guid.NewGuid(),
            NombreRazonSocial = "Ganadero Test",
            NIF = "12345678A",
            REGA = "ES21000001"
        };
    }

    [Fact]
    public async Task Handle_ShouldReturnFinca_WhenExists()
    {
        var ctx = CreateContext("GetFincaById_1");
        var ganadero = CreateGanadero();
        ctx.Ganaderos.Add(ganadero);
        var finca = CreateFinca();
        finca.GanaderoId = ganadero.Id;
        ctx.Fincas.Add(finca);
        await ctx.SaveChangesAsync(CancellationToken.None);

        var handler = new GetFincaQueryHandler(ctx);
        var result = await handler.Handle(new GetFincaQuery(finca.Id), CancellationToken.None);

        result.Should().NotBeNull();
        result!.Id.Should().Be(finca.Id);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenDeleted()
    {
        var ctx = CreateContext("GetFincaById_Deleted");
        var ganadero = CreateGanadero();
        ctx.Ganaderos.Add(ganadero);
        var finca = CreateFinca();
        finca.GanaderoId = ganadero.Id;
        finca.DeletedAt = DateTime.UtcNow;
        ctx.Fincas.Add(finca);
        await ctx.SaveChangesAsync(CancellationToken.None);

        var handler = new GetFincaQueryHandler(ctx);
        var result = await handler.Handle(new GetFincaQuery(finca.Id), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_List_ShouldFilterByGanadero()
    {
        var ctx = CreateContext("GetFincas_ByGanadero");
        var ganadero1 = CreateGanadero();
        var ganadero2 = CreateGanadero();
        ctx.Ganaderos.AddRange(ganadero1, ganadero2);
        var finca1 = CreateFinca();
        finca1.GanaderoId = ganadero1.Id;
        var finca2 = CreateFinca();
        finca2.GanaderoId = ganadero2.Id;
        ctx.Fincas.AddRange(finca1, finca2);
        await ctx.SaveChangesAsync(CancellationToken.None);

        var handler = new GetFincasQueryHandler(ctx);
        var result = await handler.Handle(
            new GetFincasQuery(GanaderoId: ganadero1.Id), CancellationToken.None);

        result.Should().HaveCount(1);
        result[0].Id.Should().Be(finca1.Id);
    }

    [Fact]
    public async Task Handle_List_ShouldReturnAll_WhenNoFilter()
    {
        var ctx = CreateContext("GetFincas_All");
        var ganadero1 = CreateGanadero();
        var ganadero2 = CreateGanadero();
        ctx.Ganaderos.AddRange(ganadero1, ganadero2);
        var finca1 = CreateFinca();
        finca1.GanaderoId = ganadero1.Id;
        var finca2 = CreateFinca();
        finca2.GanaderoId = ganadero2.Id;
        ctx.Fincas.AddRange(finca1, finca2);
        await ctx.SaveChangesAsync(CancellationToken.None);

        var handler = new GetFincasQueryHandler(ctx);
        var result = await handler.Handle(new GetFincasQuery(), CancellationToken.None);

        result.Should().HaveCount(2);
    }
}
