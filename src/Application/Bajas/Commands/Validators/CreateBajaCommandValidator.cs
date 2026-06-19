using FluentValidation;
using TrazabilidadIberica.Domain.Enums;

namespace TrazabilidadIberica.Application.Bajas.Commands.Validators;

public class CreateBajaCommandValidator : AbstractValidator<CreateBajaCommand>
{
    public CreateBajaCommandValidator()
    {
        RuleFor(v => v.AnimalId).NotEmpty();
        RuleFor(v => v.FechaBaja).NotEmpty();
        RuleFor(v => v.Causa).IsInEnum();
    }
}
