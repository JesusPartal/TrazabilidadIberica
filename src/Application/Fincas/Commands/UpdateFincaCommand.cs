using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Fincas.Commands;

public record UpdateFincaCommand(
    Guid Id,
    Guid GanaderoId,
    string Nombre,
    string CodigoREGA,
    string Municipio,
    string Provincia,
    decimal HectareasDehesa,
    decimal HectareasMontanera,
    string? Coordenadas,
    string TipoExplotacion,
    bool EsElaboradora
) : IRequest;

public class UpdateFincaCommandHandler : IRequestHandler<UpdateFincaCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateFincaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateFincaCommand request, CancellationToken cancellationToken)
    {
        var finca = await _context.Fincas.FindAsync(new object[] { request.Id }, cancellationToken);
        if (finca is null)
            throw new KeyNotFoundException($"Finca {request.Id} no encontrada");

        finca.GanaderoId = request.GanaderoId;
        finca.Nombre = request.Nombre;
        finca.CodigoREGA = request.CodigoREGA;
        finca.Municipio = request.Municipio;
        finca.Provincia = request.Provincia;
        finca.HectareasDehesa = request.HectareasDehesa;
        finca.HectareasMontanera = request.HectareasMontanera;
        finca.Coordenadas = request.Coordenadas;
        finca.TipoExplotacion = Enum.Parse<TipoExplotacion>(request.TipoExplotacion);
        finca.EsElaboradora = request.EsElaboradora;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
