using TrazabilidadIberica.Domain.Common;

namespace TrazabilidadIberica.Domain.Entities;

public class TratamientoVeterinario : BaseEntity
{
    public Guid AnimalId { get; set; }
    public Guid VeterinarioId { get; set; }
    public required string NombreMedicamento { get; set; }
    public string? NumeroLote { get; set; }
    public DateTime FechaAdministracion { get; set; }
    public DateTime? FechaCaducidad { get; set; }
    public decimal DosisAdministrada { get; set; }
    public string? UnidadDosis { get; set; }
    public string? ViaAdministracion { get; set; }
    public int PeriodoSupresionDias { get; set; }
    public DateTime FechaFinSupresion { get; set; }

    public Animal Animal { get; set; } = null!;
    public Veterinario Veterinario { get; set; } = null!;
}
