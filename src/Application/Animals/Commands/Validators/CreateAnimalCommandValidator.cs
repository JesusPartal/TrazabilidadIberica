using FluentValidation;

namespace TrazabilidadIberica.Application.Animals.Commands.Validators;

public class CreateAnimalCommandValidator : AbstractValidator<CreateAnimalCommand>
{
    public CreateAnimalCommandValidator()
    {
        RuleFor(v => v.NumeroCrotal).NotEmpty().MaximumLength(50);
        RuleFor(v => v.RazaIberica).NotEmpty().MaximumLength(100);
        RuleFor(v => v.PorcentajeIberico).InclusiveBetween(0, 100);
        RuleFor(v => v.PesoNacimientoKg).GreaterThan(0);
        RuleFor(v => v.FechaNacimiento).LessThan(DateTime.UtcNow).NotEmpty();
        RuleFor(v => v.FincaActualId).NotEmpty();
    }
}
