using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class RegistroAlimentacion : BaseEntity
{
    public Guid LoteId { get; set; }
    public TipoAlimentacion TipoAlimentacion { get; set; }
    public string? NombreProducto { get; set; }
    public string? Proveedor { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public decimal CantidadKgDia { get; set; }
    public string? NumeroLote { get; set; }

    public Lote Lote { get; set; } = null!;
}
