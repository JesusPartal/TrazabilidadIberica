using TrazabilidadIberica.Domain.Common;

namespace TrazabilidadIberica.Domain.Entities;

public class Ganadero : BaseEntity
{
    public required string NombreRazonSocial { get; set; }
    public required string NIF { get; set; }
    public required string REGA { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public string? DireccionCompleta { get; set; }
    public string? IdentityUserId { get; set; }

    public ICollection<Finca> Fincas { get; set; } = new List<Finca>();
}
