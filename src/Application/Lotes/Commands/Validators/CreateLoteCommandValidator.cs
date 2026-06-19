using FluentValidation;

namespace TrazabilidadIberica.Application.Lotes.Commands.Validators;

public class CreateLoteCommandValidator : AbstractValidator<CreateLoteCommand>
{
    public CreateLoteCommandValidator()
    {
        RuleFor(v => v.CodigoLote).NotEmpty().MaximumLength(100);
        RuleFor(v => v.FechaFormacion).NotEmpty().LessThan(DateTime.UtcNow);
        RuleFor(v => v.NumeroAnimales).GreaterThan(0);
        RuleFor(v => v.PesoMedioKg).GreaterThan(0);
        RuleFor(v => v.ComposicionRacial).NotEmpty().MaximumLength(200);
        RuleFor(v => v.FincaId).NotEmpty();
    }
}
