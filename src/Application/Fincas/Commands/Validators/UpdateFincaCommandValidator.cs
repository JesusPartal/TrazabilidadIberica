using FluentValidation;

namespace TrazabilidadIberica.Application.Fincas.Commands.Validators;

public class UpdateFincaCommandValidator : AbstractValidator<UpdateFincaCommand>
{
    public UpdateFincaCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();
        RuleFor(v => v.GanaderoId).NotEmpty();
        RuleFor(v => v.Nombre).NotEmpty().MaximumLength(200);
        RuleFor(v => v.CodigoREGA).NotEmpty().MaximumLength(50);
        RuleFor(v => v.Municipio).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Provincia).NotEmpty().MaximumLength(100);
        RuleFor(v => v.TipoExplotacion).NotEmpty();
    }
}
