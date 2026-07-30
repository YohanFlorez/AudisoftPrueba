using AudisoftPrueba.Application.DTOs.Estudiante;
using FluentValidation;

namespace AudisoftPrueba.Application.Validators;

public class EstudianteCreateDtoValidator : AbstractValidator<EstudianteCreateDto>
{
    public EstudianteCreateDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del estudiante es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no debe superar 150 caracteres.");
    }
}

public class EstudianteUpdateDtoValidator : AbstractValidator<EstudianteUpdateDto>
{
    public EstudianteUpdateDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del estudiante es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no debe superar 150 caracteres.");
    }
}
