using FluentValidation;

namespace TrazabilidadIberica.Application.Veterinarios.Commands.Validators;

public class CreateVeterinarioCommandValidator : AbstractValidator<CreateVeterinarioCommand>
{
    public CreateVeterinarioCommandValidator()
    {
        RuleFor(v => v.NombreCompleto).NotEmpty();
        RuleFor(v => v.NumColegiado).NotEmpty();
    }
}
