using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class InspeccionDOP : BaseEntity
{
    public Guid FincaId { get; set; }
    public Guid? CampaniaMontaneraId { get; set; }
    public DateTime FechaVisita { get; set; }
    public required string NombreInspector { get; set; }
    public required string TipoInspeccion { get; set; }
    public ResultadoInspeccion Resultado { get; set; }
    public string? NumActa { get; set; }
    public string? Observaciones { get; set; }

    public Finca Finca { get; set; } = null!;
    public CampaniaMontanera? CampaniaMontanera { get; set; }
}
