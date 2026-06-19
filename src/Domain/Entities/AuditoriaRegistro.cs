using TrazabilidadIberica.Domain.Common;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Domain.Entities;

public class AuditoriaRegistro : BaseEntity
{
    public required string Entidad { get; set; }
    public Guid EntidadId { get; set; }
    public AccionAuditoria Accion { get; set; }
    public int Version { get; set; }
    public string? DatosAnteriores { get; set; }
    public string? DatosNuevos { get; set; }
    public string? NombreUsuario { get; set; }
    public Guid? UsuarioId { get; set; }
    public DateTime FechaCambio { get; set; }
    public bool EsVersionActual { get; set; }
    public string? MotivoCorreccion { get; set; }
}
