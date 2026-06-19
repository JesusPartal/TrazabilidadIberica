using FluentValidation;

namespace TrazabilidadIberica.Application.Fincas.Commands.Validators;

public class CreateFincaCommandValidator : AbstractValidator<CreateFincaCommand>
{
    public CreateFincaCommandValidator()
    {
        RuleFor(v => v.Nombre).NotEmpty().MaximumLength(200);
        RuleFor(v => v.CodigoREGA).NotEmpty().MaximumLength(50);
        RuleFor(v => v.Municipio).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Provincia).NotEmpty().MaximumLength(100);
        RuleFor(v => v.HectareasDehesa).GreaterThanOrEqualTo(0);
        RuleFor(v => v.HectareasMontanera).GreaterThanOrEqualTo(0);
        RuleFor(v => v.TipoExplotacion)
            .NotEmpty()
            .Must(v => Enum.TryParse<Domain.Enums.TipoExplotacion>(v, true, out _))
            .WithMessage("TipoExplotacion debe ser uno de: Intensiva, Extensiva, Mixta");
        RuleFor(v => v.GanaderoId).NotEmpty();
    }
}
