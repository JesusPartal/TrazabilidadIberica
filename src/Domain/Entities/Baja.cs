using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class Baja : BaseEntity
{
    public Guid AnimalId { get; set; }
    public DateTime FechaBaja { get; set; }
    public CausaBaja Causa { get; set; }
    public string? Destino { get; set; }
    public string? NumGuiaAsociada { get; set; }
    public string? Observaciones { get; set; }

    public Animal Animal { get; set; } = null!;
}
