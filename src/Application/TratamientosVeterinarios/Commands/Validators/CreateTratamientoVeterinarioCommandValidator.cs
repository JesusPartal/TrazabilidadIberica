using FluentValidation;

namespace TrazabilidadIberica.Application.TratamientosVeterinarios.Commands.Validators;

public class CreateTratamientoVeterinarioCommandValidator : AbstractValidator<CreateTratamientoVeterinarioCommand>
{
    public CreateTratamientoVeterinarioCommandValidator()
    {
        RuleFor(v => v.AnimalId).NotEmpty();
        RuleFor(v => v.VeterinarioId).NotEmpty();
        RuleFor(v => v.NombreMedicamento).NotEmpty();
        RuleFor(v => v.FechaAdministracion).NotEmpty();
        RuleFor(v => v.DosisAdministrada).GreaterThan(0);
        RuleFor(v => v.PeriodoSupresionDias).GreaterThanOrEqualTo(0);
        RuleFor(v => v.FechaFinSupresion).NotEmpty();
    }
}
