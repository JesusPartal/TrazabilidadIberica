using FluentValidation;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.MovimientosAnimal.Commands.Validators;

public class CreateMovimientoAnimalCommandValidator : AbstractValidator<CreateMovimientoAnimalCommand>
{
    public CreateMovimientoAnimalCommandValidator()
    {
        RuleFor(v => v.AnimalId).NotEmpty();
        RuleFor(v => v.FincaOrigenId).NotEmpty();
        RuleFor(v => v.FincaDestinoId).NotEmpty();
        RuleFor(v => v.TipoMovimiento).IsInEnum();
        RuleFor(v => v.FechaMovimiento).NotEmpty();
    }
}
