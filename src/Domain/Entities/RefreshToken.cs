using TrazabilidadIberica.Domain.Common;

namespace TrazabilidadIberica.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public required string Token { get; set; }
    public required string IdentityUserId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime? RevokedAt { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired;
}
