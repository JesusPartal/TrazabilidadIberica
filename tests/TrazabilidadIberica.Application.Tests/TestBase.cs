using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Tests;

public abstract class TestBase
{
    protected static IApplicationDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;

        return new TestDbContext(options);
    }

    protected static Finca CreateFinca(Guid? id = null)
    {
        return new Finca
        {
            Id = id ?? Guid.NewGuid(),
            GanaderoId = Guid.NewGuid(),
            Nombre = "Finca Test",
            CodigoREGA = "REGA001",
            Municipio = "Jabugo",
            Provincia = "Huelva",
            HectareasDehesa = 100,
            HectareasMontanera = 50,
            TipoExplotacion = Domain.Enums.TipoExplotacion.Extensiva,
            EsElaboradora = false
        };
    }

    protected static Animal CreateAnimal(Guid fincaId, Guid? loteId = null, Guid? id = null)
    {
        return new Animal
        {
            Id = id ?? Guid.NewGuid(),
            NumeroCrotal = "ES001234567890",
            RazaIberica = "Ibérico",
            PorcentajeIberico = 100,
            FechaNacimiento = new DateTime(2024, 1, 15),
            Sexo = "Macho",
            PesoNacimientoKg = 1.5m,
            FincaActualId = fincaId,
            LoteActualId = loteId,
            EstadoActual = Domain.Enums.EstadoAnimal.Activo
        };
    }
}

public class TestDbContext : DbContext, IApplicationDbContext
{
    public TestDbContext(DbContextOptions<TestDbContext> options) : base(options) { }

    public DbSet<Ganadero> Ganaderos => Set<Ganadero>();
    public DbSet<Finca> Fincas => Set<Finca>();
    public DbSet<Lote> Lotes => Set<Lote>();
    public DbSet<Animal> Animales => Set<Animal>();
    public DbSet<AnimalLoteHistorico> AnimalesLoteHistorico => Set<AnimalLoteHistorico>();
    public DbSet<MovimientoLote> MovimientosLote => Set<MovimientoLote>();
    public DbSet<MovimientoLoteAnimal> MovimientosLoteAnimal => Set<MovimientoLoteAnimal>();
    public DbSet<MovimientoAnimal> MovimientosAnimal => Set<MovimientoAnimal>();
    public DbSet<Veterinario> Veterinarios => Set<Veterinario>();
    public DbSet<TratamientoVeterinario> TratamientosVeterinarios => Set<TratamientoVeterinario>();
    public DbSet<RegistroAlimentacion> RegistrosAlimentacion => Set<RegistroAlimentacion>();
    public DbSet<Baja> Bajas => Set<Baja>();
    public DbSet<CampaniaMontanera> CampaniasMontanera => Set<CampaniaMontanera>();
    public DbSet<EntradaMontanera> EntradasMontanera => Set<EntradaMontanera>();
    public DbSet<InspeccionDOP> InspeccionesDOP => Set<InspeccionDOP>();
    public DbSet<Documento> Documentos => Set<Documento>();
    public DbSet<AuditoriaRegistro> AuditoriaRegistros => Set<AuditoriaRegistro>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
}
