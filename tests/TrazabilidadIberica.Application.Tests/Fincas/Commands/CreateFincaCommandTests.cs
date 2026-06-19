using FluentAssertions;
using TrazabilidadIberica.Application.Fincas.Commands;

namespace TrazabilidadIberica.Application.Tests.Fincas.Commands;

public class CreateFincaCommandTests : TestBase
{
    [Fact]
    public async Task Handle_ShouldCreateFinca_WithCorrectValues()
    {
        var context = CreateContext("CreateFinca_1");
        var handler = new CreateFincaCommandHandler(context);
        var command = new CreateFincaCommand(
            GanaderoId: Guid.NewGuid(),
            Nombre: "Dehesa San Antonio",
            CodigoREGA: "ES21000001",
            Municipio: "Jabugo",
            Provincia: "Huelva",
            HectareasDehesa: 250.5m,
            HectareasMontanera: 120.3m,
            Coordenadas: "37.5,-6.5",
            TipoExplotacion: "Extensiva",
            EsElaboradora: true
        );

        var fincaId = await handler.Handle(command, CancellationToken.None);

        var finca = await context.Fincas.FindAsync(fincaId);
        finca.Should().NotBeNull();
        finca!.Nombre.Should().Be("Dehesa San Antonio");
        finca.CodigoREGA.Should().Be("ES21000001");
        finca.HectareasDehesa.Should().Be(250.5m);
        finca.HectareasMontanera.Should().Be(120.3m);
    }

    [Fact]
    public async Task Handle_ShouldReturnNewGuid()
    {
        var context = CreateContext("CreateFinca_2");
        var handler = new CreateFincaCommandHandler(context);
        var command = new CreateFincaCommand(
            Guid.NewGuid(), "Test", "REGATST", "Test", "Test",
            10, 5, null, "Extensiva", false
        );

        var fincaId = await handler.Handle(command, CancellationToken.None);

        fincaId.Should().NotBeEmpty();
    }
}
