using FluentValidation;

namespace TrazabilidadIberica.Application.Auth.Commands.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(v => v.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(v => v.Password).NotEmpty().MinimumLength(6).MaximumLength(100);
        RuleFor(v => v.NombreRazonSocial).NotEmpty().MaximumLength(200);
        RuleFor(v => v.NIF).NotEmpty().MaximumLength(20);
        RuleFor(v => v.REGA).NotEmpty().MaximumLength(50);
    }
}
