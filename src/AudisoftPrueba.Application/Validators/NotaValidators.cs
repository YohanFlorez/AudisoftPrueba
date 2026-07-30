using AudisoftPrueba.Application.DTOs.Nota;
using FluentValidation;

namespace AudisoftPrueba.Application.Validators;

public class NotaCreateDtoValidator : AbstractValidator<NotaCreateDto>
{
    public NotaCreateDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre/descripción de la nota es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no debe superar 150 caracteres.");

        RuleFor(x => x.Valor)
            .InclusiveBetween(0, 5).WithMessage("El valor de la nota debe estar entre 0.0 y 5.0.");

        RuleFor(x => x.IdProfesor)
            .GreaterThan(0).WithMessage("Debe indicar un profesor válido.");

        RuleFor(x => x.IdEstudiante)
            .GreaterThan(0).WithMessage("Debe indicar un estudiante válido.");
    }
}

public class NotaUpdateDtoValidator : AbstractValidator<NotaUpdateDto>
{
    public NotaUpdateDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre/descripción de la nota es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no debe superar 150 caracteres.");

        RuleFor(x => x.Valor)
            .InclusiveBetween(0, 5).WithMessage("El valor de la nota debe estar entre 0.0 y 5.0.");

        RuleFor(x => x.IdProfesor)
            .GreaterThan(0).WithMessage("Debe indicar un profesor válido.");

        RuleFor(x => x.IdEstudiante)
            .GreaterThan(0).WithMessage("Debe indicar un estudiante válido.");
    }
}
