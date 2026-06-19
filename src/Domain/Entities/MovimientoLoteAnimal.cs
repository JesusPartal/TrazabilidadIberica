using TrazabilidadIberica.Domain.Common;

namespace TrazabilidadIberica.Domain.Entities;

public class MovimientoLoteAnimal : BaseEntity
{
    public Guid MovimientoLoteId { get; set; }
    public Guid AnimalId { get; set; }

    public MovimientoLote MovimientoLote { get; set; } = null!;
    public Animal Animal { get; set; } = null!;
}
