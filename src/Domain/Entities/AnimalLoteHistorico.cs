using TrazabilidadIberica.Domain.Common;

namespace TrazabilidadIberica.Domain.Entities;

public class AnimalLoteHistorico : BaseEntity
{
    public Guid AnimalId { get; set; }
    public Guid LoteId { get; set; }
    public DateTime FechaEntrada { get; set; }
    public DateTime? FechaSalida { get; set; }

    public Animal Animal { get; set; } = null!;
    public Lote Lote { get; set; } = null!;
}
