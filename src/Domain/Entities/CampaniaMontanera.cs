using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class CampaniaMontanera : BaseEntity
{
    public Guid FincaId { get; set; }
    public int Temporada { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public decimal HectareasUtilizadas { get; set; }
    public int CapacidadMaxAnimales { get; set; }
    public EstadoCampania EstadoCampania { get; set; }
    public string? NumAutorizacionDO { get; set; }

    public Finca Finca { get; set; } = null!;
    public ICollection<EntradaMontanera> EntradasMontanera { get; set; } = new List<EntradaMontanera>();
}
