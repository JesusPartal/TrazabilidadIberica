using MediatR;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Domain.Entities;

namespace TrazabilidadIberica.Application.Fincas.Commands;

public record CreateFincaCommand(
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
) : IRequest<Guid>;

public class CreateFincaCommandHandler : IRequestHandler<CreateFincaCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateFincaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateFincaCommand request, CancellationToken cancellationToken)
    {
        var finca = new Finca
        {
            GanaderoId = request.GanaderoId,
            Nombre = request.Nombre,
            CodigoREGA = request.CodigoREGA,
            Municipio = request.Municipio,
            Provincia = request.Provincia,
            HectareasDehesa = request.HectareasDehesa,
            HectareasMontanera = request.HectareasMontanera,
            Coordenadas = request.Coordenadas,
            TipoExplotacion = Enum.Parse<Domain.Enums.TipoExplotacion>(request.TipoExplotacion),
            EsElaboradora = request.EsElaboradora
        };

        _context.Fincas.Add(finca);
        await _context.SaveChangesAsync(cancellationToken);

        return finca.Id;
    }
}
