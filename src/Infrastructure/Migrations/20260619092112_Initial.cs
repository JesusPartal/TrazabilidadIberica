using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrazabilidadIberica.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditoriaRegistros",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Entidad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntidadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Accion = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    DatosAnteriores = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DatosNuevos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NombreUsuario = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsuarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FechaCambio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EsVersionActual = table.Column<bool>(type: "bit", nullable: false),
                    MotivoCorreccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditoriaRegistros", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Documentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoEntidad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntidadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoDocumento = table.Column<int>(type: "int", nullable: false),
                    NombreArchivo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TipoMime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UrlLocal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UrlServidor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TamanioBytes = table.Column<long>(type: "bigint", nullable: false),
                    NumeroReferencia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documentos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ganaderos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreRazonSocial = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NIF = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    REGA = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DireccionCompleta = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ganaderos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Veterinarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreCompleto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumColegiado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Veterinarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Fincas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GanaderoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CodigoREGA = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Municipio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Provincia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HectareasDehesa = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HectareasMontanera = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Coordenadas = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TipoExplotacion = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    EsElaboradora = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fincas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fincas_Ganaderos_GanaderoId",
                        column: x => x.GanaderoId,
                        principalTable: "Ganaderos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CampaniasMontanera",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Temporada = table.Column<int>(type: "int", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HectareasUtilizadas = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CapacidadMaxAnimales = table.Column<int>(type: "int", nullable: false),
                    EstadoCampania = table.Column<int>(type: "int", nullable: false),
                    NumAutorizacionDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaniasMontanera", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaniasMontanera_Fincas_FincaId",
                        column: x => x.FincaId,
                        principalTable: "Fincas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Lotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CodigoLote = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaFormacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    NumeroAnimales = table.Column<int>(type: "int", nullable: false),
                    PesoMedioKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ComposicionRacial = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Origen = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Cerrado = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lotes_Fincas_FincaId",
                        column: x => x.FincaId,
                        principalTable: "Fincas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InspeccionesDOP",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaniaMontaneraId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FechaVisita = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NombreInspector = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TipoInspeccion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Resultado = table.Column<int>(type: "int", nullable: false),
                    NumActa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InspeccionesDOP", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InspeccionesDOP_CampaniasMontanera_CampaniaMontaneraId",
                        column: x => x.CampaniaMontaneraId,
                        principalTable: "CampaniasMontanera",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_InspeccionesDOP_Fincas_FincaId",
                        column: x => x.FincaId,
                        principalTable: "Fincas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Animales",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoteActualId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FincaActualId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NumeroCrotal = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RazaIberica = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PorcentajeIberico = table.Column<int>(type: "int", nullable: false),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Sexo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    PesoNacimientoKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EstadoActual = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    OrigenAnimal = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animales", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Animales_Fincas_FincaActualId",
                        column: x => x.FincaActualId,
                        principalTable: "Fincas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Animales_Lotes_LoteActualId",
                        column: x => x.LoteActualId,
                        principalTable: "Lotes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MovimientosLote",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaOrigenId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaDestinoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoMovimiento = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FechaMovimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumeroAnimales = table.Column<int>(type: "int", nullable: false),
                    NumeroGuia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NumDocumentoAcompanamiento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CSV = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Motivo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OperadorDestino = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    RegistradoEn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimientosLote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovimientosLote_Fincas_FincaDestinoId",
                        column: x => x.FincaDestinoId,
                        principalTable: "Fincas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MovimientosLote_Fincas_FincaOrigenId",
                        column: x => x.FincaOrigenId,
                        principalTable: "Fincas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MovimientosLote_Lotes_LoteId",
                        column: x => x.LoteId,
                        principalTable: "Lotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RegistrosAlimentacion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoAlimentacion = table.Column<int>(type: "int", nullable: false),
                    NombreProducto = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Proveedor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CantidadKgDia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NumeroLote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosAlimentacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosAlimentacion_Lotes_LoteId",
                        column: x => x.LoteId,
                        principalTable: "Lotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnimalesLoteHistorico",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FechaEntrada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaSalida = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimalesLoteHistorico", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnimalesLoteHistorico_Animales_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnimalesLoteHistorico_Lotes_LoteId",
                        column: x => x.LoteId,
                        principalTable: "Lotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bajas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FechaBaja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Causa = table.Column<int>(type: "int", nullable: false),
                    Destino = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumGuiaAsociada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bajas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bajas_Animales_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EntradasMontanera",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaniaMontaneraId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FechaEntrada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PesoEntradaKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaSalida = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PesoSalidaKg = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IncrementoPesoKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiasMontanera = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CalificacionDOP = table.Column<int>(type: "int", nullable: false),
                    AptoDO = table.Column<bool>(type: "bit", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntradasMontanera", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EntradasMontanera_Animales_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EntradasMontanera_CampaniasMontanera_CampaniaMontaneraId",
                        column: x => x.CampaniaMontaneraId,
                        principalTable: "CampaniasMontanera",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MovimientosAnimal",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaOrigenId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FincaDestinoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoMovimiento = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FechaMovimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumeroGuia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Motivo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OperadorDestino = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NumDocumentoAcompanamiento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CSV = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimientosAnimal", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovimientosAnimal_Animales_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovimientosAnimal_Fincas_FincaDestinoId",
                        column: x => x.FincaDestinoId,
                        principalTable: "Fincas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MovimientosAnimal_Fincas_FincaOrigenId",
                        column: x => x.FincaOrigenId,
                        principalTable: "Fincas",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TratamientosVeterinarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VeterinarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NombreMedicamento = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NumeroLote = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FechaAdministracion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaCaducidad = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DosisAdministrada = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UnidadDosis = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ViaAdministracion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PeriodoSupresionDias = table.Column<int>(type: "int", nullable: false),
                    FechaFinSupresion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TratamientosVeterinarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TratamientosVeterinarios_Animales_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TratamientosVeterinarios_Veterinarios_VeterinarioId",
                        column: x => x.VeterinarioId,
                        principalTable: "Veterinarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MovimientosLoteAnimal",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MovimientoLoteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOffline = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimientosLoteAnimal", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovimientosLoteAnimal_Animales_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovimientosLoteAnimal_MovimientosLote_MovimientoLoteId",
                        column: x => x.MovimientoLoteId,
                        principalTable: "MovimientosLote",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Animales_FincaActualId",
                table: "Animales",
                column: "FincaActualId");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_LoteActualId",
                table: "Animales",
                column: "LoteActualId");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_NumeroCrotal",
                table: "Animales",
                column: "NumeroCrotal");

            migrationBuilder.CreateIndex(
                name: "IX_AnimalesLoteHistorico_AnimalId",
                table: "AnimalesLoteHistorico",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_AnimalesLoteHistorico_LoteId",
                table: "AnimalesLoteHistorico",
                column: "LoteId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Bajas_AnimalId",
                table: "Bajas",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaniasMontanera_FincaId",
                table: "CampaniasMontanera",
                column: "FincaId");

            migrationBuilder.CreateIndex(
                name: "IX_EntradasMontanera_AnimalId",
                table: "EntradasMontanera",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_EntradasMontanera_CampaniaMontaneraId",
                table: "EntradasMontanera",
                column: "CampaniaMontaneraId");

            migrationBuilder.CreateIndex(
                name: "IX_Fincas_GanaderoId",
                table: "Fincas",
                column: "GanaderoId");

            migrationBuilder.CreateIndex(
                name: "IX_Ganaderos_NIF",
                table: "Ganaderos",
                column: "NIF",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ganaderos_REGA",
                table: "Ganaderos",
                column: "REGA",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InspeccionesDOP_CampaniaMontaneraId",
                table: "InspeccionesDOP",
                column: "CampaniaMontaneraId");

            migrationBuilder.CreateIndex(
                name: "IX_InspeccionesDOP_FincaId",
                table: "InspeccionesDOP",
                column: "FincaId");

            migrationBuilder.CreateIndex(
                name: "IX_Lotes_FincaId",
                table: "Lotes",
                column: "FincaId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosAnimal_AnimalId",
                table: "MovimientosAnimal",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosAnimal_FincaDestinoId",
                table: "MovimientosAnimal",
                column: "FincaDestinoId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosAnimal_FincaOrigenId",
                table: "MovimientosAnimal",
                column: "FincaOrigenId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosLote_FincaDestinoId",
                table: "MovimientosLote",
                column: "FincaDestinoId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosLote_FincaOrigenId",
                table: "MovimientosLote",
                column: "FincaOrigenId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosLote_LoteId",
                table: "MovimientosLote",
                column: "LoteId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosLoteAnimal_AnimalId",
                table: "MovimientosLoteAnimal",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosLoteAnimal_MovimientoLoteId",
                table: "MovimientosLoteAnimal",
                column: "MovimientoLoteId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosAlimentacion_LoteId",
                table: "RegistrosAlimentacion",
                column: "LoteId");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientosVeterinarios_AnimalId",
                table: "TratamientosVeterinarios",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_TratamientosVeterinarios_VeterinarioId",
                table: "TratamientosVeterinarios",
                column: "VeterinarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnimalesLoteHistorico");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AuditoriaRegistros");

            migrationBuilder.DropTable(
                name: "Bajas");

            migrationBuilder.DropTable(
                name: "Documentos");

            migrationBuilder.DropTable(
                name: "EntradasMontanera");

            migrationBuilder.DropTable(
                name: "InspeccionesDOP");

            migrationBuilder.DropTable(
                name: "MovimientosAnimal");

            migrationBuilder.DropTable(
                name: "MovimientosLoteAnimal");

            migrationBuilder.DropTable(
                name: "RegistrosAlimentacion");

            migrationBuilder.DropTable(
                name: "TratamientosVeterinarios");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "CampaniasMontanera");

            migrationBuilder.DropTable(
                name: "MovimientosLote");

            migrationBuilder.DropTable(
                name: "Animales");

            migrationBuilder.DropTable(
                name: "Veterinarios");

            migrationBuilder.DropTable(
                name: "Lotes");

            migrationBuilder.DropTable(
                name: "Fincas");

            migrationBuilder.DropTable(
                name: "Ganaderos");
        }
    }
}
