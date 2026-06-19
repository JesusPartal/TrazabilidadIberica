using FluentValidation;
using TrazabilidadIberica.Application.Ganaderos.Commands;

namespace TrazabilidadIberica.Application.Ganaderos.Commands.Validators;

public class CreateGanaderoCommandValidator : AbstractValidator<CreateGanaderoCommand>
{
    public CreateGanaderoCommandValidator()
    {
        RuleFor(v => v.NombreRazonSocial).NotEmpty().MaximumLength(200);
        RuleFor(v => v.NIF).NotEmpty().Matches(@"^\d{8}[A-Za-z]$").WithMessage("El NIF debe tener 8 dígitos seguidos de una letra");
        RuleFor(v => v.REGA).NotEmpty().MaximumLength(50);
    }
}
