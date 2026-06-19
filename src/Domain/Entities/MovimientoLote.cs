using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class MovimientoLote : BaseEntity
{
    public Guid LoteId { get; set; }
    public Guid FincaOrigenId { get; set; }
    public Guid FincaDestinoId { get; set; }
    public TipoMovimiento TipoMovimiento { get; set; }
    public DateTime FechaMovimiento { get; set; }
    public int NumeroAnimales { get; set; }
    public string? NumeroGuia { get; set; }
    public string? NumDocumentoAcompanamiento { get; set; }
    public string? CSV { get; set; }
    public string? Motivo { get; set; }
    public string? OperadorDestino { get; set; }
    public DateTime RegistradoEn { get; set; }

    public Lote Lote { get; set; } = null!;
    public Finca FincaOrigen { get; set; } = null!;
    public Finca FincaDestino { get; set; } = null!;
    public ICollection<MovimientoLoteAnimal> Animales { get; set; } = new List<MovimientoLoteAnimal>();
}
