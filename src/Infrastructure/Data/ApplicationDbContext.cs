using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
