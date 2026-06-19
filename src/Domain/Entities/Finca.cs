using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class Finca : BaseEntity
{
    public Guid GanaderoId { get; set; }
    public required string Nombre { get; set; }
    public required string CodigoREGA { get; set; }
    public required string Municipio { get; set; }
    public required string Provincia { get; set; }
    public decimal HectareasDehesa { get; set; }
    public decimal HectareasMontanera { get; set; }
    public string? Coordenadas { get; set; }
    public TipoExplotacion TipoExplotacion { get; set; }
    public bool EsElaboradora { get; set; }

    public Ganadero Ganadero { get; set; } = null!;
    public ICollection<Lote> Lotes { get; set; } = new List<Lote>();
    public ICollection<CampaniaMontanera> CampaniasMontanera { get; set; } = new List<CampaniaMontanera>();
    public ICollection<InspeccionDOP> InspeccionesDOP { get; set; } = new List<InspeccionDOP>();
}
