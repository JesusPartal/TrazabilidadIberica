using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class Lote : BaseEntity
{
    public Guid FincaId { get; set; }
    public required string CodigoLote { get; set; }
    public DateTime FechaFormacion { get; set; }
    public CategoriaLote Categoria { get; set; }
    public int NumeroAnimales { get; set; }
    public decimal PesoMedioKg { get; set; }
    public required string ComposicionRacial { get; set; }
    public string? Origen { get; set; }
    public bool Cerrado { get; set; }

    public Finca Finca { get; set; } = null!;
    public ICollection<Animal> Animales { get; set; } = new List<Animal>();
    public ICollection<MovimientoLote> MovimientosLote { get; set; } = new List<MovimientoLote>();
    public ICollection<RegistroAlimentacion> RegistrosAlimentacion { get; set; } = new List<RegistroAlimentacion>();
    public ICollection<AnimalLoteHistorico> AnimalesHistorico { get; set; } = new List<AnimalLoteHistorico>();
}
