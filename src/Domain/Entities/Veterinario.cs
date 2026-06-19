using TrazabilidadIberica.Domain.Common;

namespace TrazabilidadIberica.Domain.Entities;

public class Veterinario : BaseEntity
{
    public required string NombreCompleto { get; set; }
    public required string NumColegiado { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }

    public ICollection<TratamientoVeterinario> Tratamientos { get; set; } = new List<TratamientoVeterinario>();
}
