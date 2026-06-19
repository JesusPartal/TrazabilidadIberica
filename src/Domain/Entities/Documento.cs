using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class Documento : BaseEntity
{
    public required string TipoEntidad { get; set; }
    public Guid EntidadId { get; set; }
    public TipoDocumento TipoDocumento { get; set; }
    public required string NombreArchivo { get; set; }
    public string? TipoMime { get; set; }
    public string? UrlLocal { get; set; }
    public string? UrlServidor { get; set; }
    public long TamanioBytes { get; set; }
    public string? NumeroReferencia { get; set; }
    public string? Descripcion { get; set; }
}
