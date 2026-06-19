using FluentValidation;

namespace TrazabilidadIberica.Application.CampaniasMontanera.Commands.Validators;

public class CreateCampaniaMontaneraCommandValidator : AbstractValidator<CreateCampaniaMontaneraCommand>
{
    public CreateCampaniaMontaneraCommandValidator()
    {
        RuleFor(v => v.FincaId).NotEmpty();
        RuleFor(v => v.Temporada).InclusiveBetween(2000, 2100);
        RuleFor(v => v.FechaInicio).NotEmpty();
        RuleFor(v => v.HectareasUtilizadas).GreaterThan(0);
        RuleFor(v => v.CapacidadMaxAnimales).GreaterThan(0);
    }
}
