namespace TrazabilidadIberica.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? ClientId { get; set; }
    public bool CreatedOffline { get; set; }
    public DateTime? DeletedAt { get; set; }
}
