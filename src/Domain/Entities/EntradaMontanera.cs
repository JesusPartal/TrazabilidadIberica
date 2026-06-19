using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class EntradaMontanera : BaseEntity
{
    public Guid AnimalId { get; set; }
    public Guid CampaniaMontaneraId { get; set; }
    public DateTime FechaEntrada { get; set; }
    public decimal PesoEntradaKg { get; set; }
    public DateTime? FechaSalida { get; set; }
    public decimal? PesoSalidaKg { get; set; }
    public decimal IncrementoPesoKg { get; set; }
    public decimal DiasMontanera { get; set; }
    public CalificacionDOP CalificacionDOP { get; set; }
    public bool AptoDO { get; set; }
    public string? Observaciones { get; set; }

    public Animal Animal { get; set; } = null!;
    public CampaniaMontanera CampaniaMontanera { get; set; } = null!;
}
