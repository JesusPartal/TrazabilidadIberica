using Microsoft.EntityFrameworkCore;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Ganadero> Ganaderos { get; }
    DbSet<Finca> Fincas { get; }
    DbSet<Lote> Lotes { get; }
    DbSet<Animal> Animales { get; }
    DbSet<AnimalLoteHistorico> AnimalesLoteHistorico { get; }
    DbSet<MovimientoLote> MovimientosLote { get; }
    DbSet<MovimientoLoteAnimal> MovimientosLoteAnimal { get; }
    DbSet<MovimientoAnimal> MovimientosAnimal { get; }
    DbSet<Veterinario> Veterinarios { get; }
    DbSet<TratamientoVeterinario> TratamientosVeterinarios { get; }
    DbSet<RegistroAlimentacion> RegistrosAlimentacion { get; }
    DbSet<Baja> Bajas { get; }
    DbSet<CampaniaMontanera> CampaniasMontanera { get; }
    DbSet<EntradaMontanera> EntradasMontanera { get; }
    DbSet<InspeccionDOP> InspeccionesDOP { get; }
    DbSet<Documento> Documentos { get; }
    DbSet<AuditoriaRegistro> AuditoriaRegistros { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
