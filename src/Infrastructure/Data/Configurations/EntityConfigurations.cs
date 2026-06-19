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

        builder.Property(e => e.IdentityUserId).HasMaxLength(450);
        builder.HasIndex(e => e.IdentityUserId).IsUnique().HasFilter("[IdentityUserId] IS NOT NULL");
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
        builder.Property(e => e.HectareasDehesa).HasPrecision(18, 2);
        builder.Property(e => e.HectareasMontanera).HasPrecision(18, 2);
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
        builder.Property(e => e.PesoMedioKg).HasPrecision(18, 2);
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
        builder.Property(e => e.PesoNacimientoKg).HasPrecision(18, 2);
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
        builder.Property(e => e.DosisAdministrada).HasPrecision(18, 2);
        builder.HasOne(e => e.Animal).WithMany(a => a.Tratamientos).HasForeignKey(e => e.AnimalId);
        builder.HasOne(e => e.Veterinario).WithMany(v => v.Tratamientos).HasForeignKey(e => e.VeterinarioId);
    }
}

public class CampaniaMontaneraConfiguration : IEntityTypeConfiguration<CampaniaMontanera>
{
    public void Configure(EntityTypeBuilder<CampaniaMontanera> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.EstadoCampania).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.NumAutorizacionDO).HasMaxLength(100);
        builder.Property(e => e.HectareasUtilizadas).HasPrecision(18, 2);
        builder.HasOne(e => e.Finca).WithMany(f => f.CampaniasMontanera).HasForeignKey(e => e.FincaId);
    }
}

public class EntradaMontaneraConfiguration : IEntityTypeConfiguration<EntradaMontanera>
{
    public void Configure(EntityTypeBuilder<EntradaMontanera> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.CalificacionDOP).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.PesoEntradaKg).HasPrecision(18, 2);
        builder.Property(e => e.PesoSalidaKg).HasPrecision(18, 2);
        builder.Property(e => e.IncrementoPesoKg).HasPrecision(18, 2);
        builder.Property(e => e.DiasMontanera).HasPrecision(18, 2);
        builder.Property(e => e.Observaciones).HasMaxLength(500);
        builder.HasOne(e => e.Animal).WithMany(a => a.EntradasMontanera).HasForeignKey(e => e.AnimalId);
        builder.HasOne(e => e.CampaniaMontanera).WithMany(c => c.EntradasMontanera).HasForeignKey(e => e.CampaniaMontaneraId);
    }
}

public class RegistroAlimentacionConfiguration : IEntityTypeConfiguration<RegistroAlimentacion>
{
    public void Configure(EntityTypeBuilder<RegistroAlimentacion> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.TipoAlimentacion).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.NombreProducto).HasMaxLength(200);
        builder.Property(e => e.Proveedor).HasMaxLength(200);
        builder.Property(e => e.NumeroLote).HasMaxLength(50);
        builder.Property(e => e.CantidadKgDia).HasPrecision(18, 2);
        builder.HasOne(e => e.Lote).WithMany(l => l.RegistrosAlimentacion).HasForeignKey(e => e.LoteId);
    }
}

public class BajaConfiguration : IEntityTypeConfiguration<Baja>
{
    public void Configure(EntityTypeBuilder<Baja> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Causa).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.Destino).HasMaxLength(200);
        builder.Property(e => e.NumGuiaAsociada).HasMaxLength(50);
        builder.Property(e => e.Observaciones).HasMaxLength(500);
        builder.HasOne(e => e.Animal).WithMany(a => a.Bajas).HasForeignKey(e => e.AnimalId);
    }
}

public class VeterinarioConfiguration : IEntityTypeConfiguration<Veterinario>
{
    public void Configure(EntityTypeBuilder<Veterinario> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.NombreCompleto).HasMaxLength(200).IsRequired();
        builder.Property(e => e.NumColegiado).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Telefono).HasMaxLength(20);
        builder.Property(e => e.Email).HasMaxLength(100);
        builder.HasIndex(e => e.NumColegiado).IsUnique();
    }
}

public class InspeccionDOPConfiguration : IEntityTypeConfiguration<InspeccionDOP>
{
    public void Configure(EntityTypeBuilder<InspeccionDOP> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.NombreInspector).HasMaxLength(200).IsRequired();
        builder.Property(e => e.TipoInspeccion).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Resultado).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.NumActa).HasMaxLength(50);
        builder.Property(e => e.Observaciones).HasMaxLength(500);
        builder.HasOne(e => e.Finca).WithMany(f => f.InspeccionesDOP).HasForeignKey(e => e.FincaId);
        builder.HasOne(e => e.CampaniaMontanera).WithMany().HasForeignKey(e => e.CampaniaMontaneraId).OnDelete(DeleteBehavior.NoAction);
    }
}

public class DocumentoConfiguration : IEntityTypeConfiguration<Documento>
{
    public void Configure(EntityTypeBuilder<Documento> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.TipoEntidad).HasMaxLength(100).IsRequired();
        builder.Property(e => e.TipoDocumento).HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.NombreArchivo).HasMaxLength(500).IsRequired();
        builder.Property(e => e.TipoMime).HasMaxLength(100);
        builder.Property(e => e.UrlLocal).HasMaxLength(1000);
        builder.Property(e => e.UrlServidor).HasMaxLength(1000);
        builder.Property(e => e.NumeroReferencia).HasMaxLength(100);
        builder.Property(e => e.Descripcion).HasMaxLength(500);
    }
}

public class AuditoriaRegistroConfiguration : IEntityTypeConfiguration<AuditoriaRegistro>
{
    public void Configure(EntityTypeBuilder<AuditoriaRegistro> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Entidad).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Accion).HasConversion<string>().HasMaxLength(20);
        builder.HasIndex(e => new { e.Entidad, e.EntidadId, e.Version });
    }
}

public class AnimalLoteHistoricoConfiguration : IEntityTypeConfiguration<AnimalLoteHistorico>
{
    public void Configure(EntityTypeBuilder<AnimalLoteHistorico> builder)
    {
        builder.HasKey(e => e.Id);
        builder.HasOne(e => e.Animal).WithMany(a => a.HistorialLotes).HasForeignKey(e => e.AnimalId);
        builder.HasOne(e => e.Lote).WithMany(l => l.AnimalesHistorico).HasForeignKey(e => e.LoteId);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Token).HasMaxLength(500).IsRequired();
        builder.Property(e => e.IdentityUserId).HasMaxLength(450).IsRequired();
        builder.HasIndex(e => e.Token).IsUnique();
        builder.HasIndex(e => e.IdentityUserId);
    }
}

public class MovimientoLoteAnimalConfiguration : IEntityTypeConfiguration<MovimientoLoteAnimal>
{
    public void Configure(EntityTypeBuilder<MovimientoLoteAnimal> builder)
    {
        builder.HasKey(e => e.Id);
        builder.HasOne(e => e.MovimientoLote).WithMany(m => m.Animales).HasForeignKey(e => e.MovimientoLoteId);
        builder.HasOne(e => e.Animal).WithMany(a => a.MovimientosLote).HasForeignKey(e => e.AnimalId);
    }
}
