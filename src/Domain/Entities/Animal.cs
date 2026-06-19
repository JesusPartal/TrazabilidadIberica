using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class Animal : BaseEntity
{
    public Guid? LoteActualId { get; set; }
    public Guid FincaActualId { get; set; }
    public required string NumeroCrotal { get; set; }
    public required string RazaIberica { get; set; }
    public int PorcentajeIberico { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? Sexo { get; set; }
    public decimal PesoNacimientoKg { get; set; }
    public EstadoAnimal EstadoActual { get; set; }
    public string? OrigenAnimal { get; set; }

    public Lote? LoteActual { get; set; }
    public Finca FincaActual { get; set; } = null!;
    public ICollection<MovimientoAnimal> MovimientosAnimal { get; set; } = new List<MovimientoAnimal>();
    public ICollection<TratamientoVeterinario> Tratamientos { get; set; } = new List<TratamientoVeterinario>();
    public ICollection<Baja> Bajas { get; set; } = new List<Baja>();
    public ICollection<EntradaMontanera> EntradasMontanera { get; set; } = new List<EntradaMontanera>();
    public ICollection<AnimalLoteHistorico> HistorialLotes { get; set; } = new List<AnimalLoteHistorico>();
    public ICollection<MovimientoLoteAnimal> MovimientosLote { get; set; } = new List<MovimientoLoteAnimal>();
}
