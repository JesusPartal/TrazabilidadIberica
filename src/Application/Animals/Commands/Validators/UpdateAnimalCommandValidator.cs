using FluentValidation;

namespace TrazabilidadIberica.Application.Animals.Commands.Validators;

public class UpdateAnimalCommandValidator : AbstractValidator<UpdateAnimalCommand>
{
    public UpdateAnimalCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();
        RuleFor(v => v.NumeroCrotal).NotEmpty().MaximumLength(50);
        RuleFor(v => v.RazaIberica).NotEmpty().MaximumLength(100);
        RuleFor(v => v.PorcentajeIberico).InclusiveBetween(0, 100);
        RuleFor(v => v.PesoNacimientoKg).GreaterThan(0);
        RuleFor(v => v.FechaNacimiento).LessThan(DateTime.UtcNow);
        RuleFor(v => v.FincaActualId).NotEmpty();
    }
}
