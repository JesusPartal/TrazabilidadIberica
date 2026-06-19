using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrazabilidadIberica.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityUserIdAndAuditFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdentityUserId",
                table: "Ganaderos",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ganaderos_IdentityUserId",
                table: "Ganaderos",
                column: "IdentityUserId",
                unique: true,
                filter: "[IdentityUserId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Ganaderos_IdentityUserId",
                table: "Ganaderos");

            migrationBuilder.DropColumn(
                name: "IdentityUserId",
                table: "Ganaderos");
        }
    }
}
