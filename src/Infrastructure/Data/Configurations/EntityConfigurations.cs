using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Infrastructure.Data.Configurations;

public class GanaderoConfiguration : IEntityTypeConfiguration<Ganadero>
{
    public void Configure(EntityTypeBuilder<Ganadero> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.NombreRazonSocial).HasMaxLength(200).IsRequired();
        builder.Property(e => e.NIF).HasMaxLength(20).IsRequired();
        builder.Property(e => e.REGA).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Telefono).HasMaxLength(20);
        builder.Property(e => e.Email).HasMaxLength(100);
        builder.Property(e => e.DireccionCompleta).HasMaxLength(500);

        builder.HasIndex(e => e.NIF).IsUnique();
        builder.HasIndex(e => e.REGA).IsUnique();
    }
}

public class FincaConfiguration : IEntityTypeConfiguration<Finca>
{
    public void Configure(EntityTypeBuilder<Finca> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(e => e.CodigoREGA).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Municipio).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Provincia).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Coordenadas).HasMaxLength(100);
        builder.Property(e => e.TipoExplotacion).HasConversion<string>().HasMaxLength(20);
        builder.HasOne(e => e.Ganadero).WithMany(g => g.Fincas).HasForeignKey(e => e.GanaderoId);
    }
}

public class LoteConfiguration : IEntityTypeConfiguration<Lote>
{
    public void Configure(EntityTypeBuilder<Lote> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.CodigoLote).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Categoria).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.ComposicionRacial).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Origen).HasMaxLength(200);
        builder.HasOne(e => e.Finca).WithMany(f => f.Lotes).HasForeignKey(e => e.FincaId);
    }
}

public class AnimalConfiguration : IEntityTypeConfiguration<Animal>
{
    public void Configure(EntityTypeBuilder<Animal> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.NumeroCrotal).HasMaxLength(50).IsRequired();
        builder.Property(e => e.RazaIberica).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Sexo).HasMaxLength(10);
        builder.Property(e => e.OrigenAnimal).HasMaxLength(200);
        builder.Property(e => e.EstadoActual).HasConversion<string>().HasMaxLength(20);
        builder.HasOne(e => e.LoteActual).WithMany(l => l.Animales).HasForeignKey(e => e.LoteActualId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(e => e.FincaActual).WithMany().HasForeignKey(e => e.FincaActualId).OnDelete(DeleteBehavior.NoAction);
        builder.HasIndex(e => e.NumeroCrotal);
    }
}

public class MovimientoLoteConfiguration : IEntityTypeConfiguration<MovimientoLote>
{
    public void Configure(EntityTypeBuilder<MovimientoLote> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.TipoMovimiento).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.NumeroGuia).HasMaxLength(50);
        builder.Property(e => e.NumDocumentoAcompanamiento).HasMaxLength(100);
        builder.Property(e => e.CSV).HasMaxLength(100);
        builder.Property(e => e.Motivo).HasMaxLength(500);
        builder.Property(e => e.OperadorDestino).HasMaxLength(200);
        builder.HasOne(e => e.Lote).WithMany(l => l.MovimientosLote).HasForeignKey(e => e.LoteId);
        builder.HasOne(e => e.FincaOrigen).WithMany().HasForeignKey(e => e.FincaOrigenId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(e => e.FincaDestino).WithMany().HasForeignKey(e => e.FincaDestinoId).OnDelete(DeleteBehavior.NoAction);
    }
}

public class MovimientoAnimalConfiguration : IEntityTypeConfiguration<MovimientoAnimal>
{
    public void Configure(EntityTypeBuilder<MovimientoAnimal> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.TipoMovimiento).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.NumeroGuia).HasMaxLength(50);
        builder.Property(e => e.Motivo).HasMaxLength(500);
        builder.Property(e => e.OperadorDestino).HasMaxLength(200);
        builder.Property(e => e.NumDocumentoAcompanamiento).HasMaxLength(100);
        builder.Property(e => e.CSV).HasMaxLength(100);
        builder.HasOne(e => e.Animal).WithMany(a => a.MovimientosAnimal).HasForeignKey(e => e.AnimalId);
        builder.HasOne(e => e.FincaOrigen).WithMany().HasForeignKey(e => e.FincaOrigenId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(e => e.FincaDestino).WithMany().HasForeignKey(e => e.FincaDestinoId).OnDelete(DeleteBehavior.NoAction);
    }
}

public class TratamientoVeterinarioConfiguration : IEntityTypeConfiguration<TratamientoVeterinario>
{
    public void Configure(EntityTypeBuilder<TratamientoVeterinario> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.NombreMedicamento).HasMaxLength(200).IsRequired();
        builder.Property(e => e.NumeroLote).HasMaxLength(50);
        builder.Property(e => e.UnidadDosis).HasMaxLength(20);
        builder.Property(e => e.ViaAdministracion).HasMaxLength(50);
        builder.HasOne(e => e.Animal).WithMany(a => a.Tratamientos).HasForeignKey(e => e.AnimalId);
        builder.HasOne(e => e.Veterinario).WithMany(v => v.Tratamientos).HasForeignKey(e => e.VeterinarioId);
    }
}
