using AudisoftPrueba.Application.DTOs.Profesor;
using FluentValidation;

namespace AudisoftPrueba.Application.Validators;

public class ProfesorCreateDtoValidator : AbstractValidator<ProfesorCreateDto>
{
    public ProfesorCreateDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del profesor es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no debe superar 150 caracteres.");
    }
}

public class ProfesorUpdateDtoValidator : AbstractValidator<ProfesorUpdateDto>
{
    public ProfesorUpdateDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del profesor es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no debe superar 150 caracteres.");
    }
}
