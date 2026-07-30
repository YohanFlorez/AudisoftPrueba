using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AudisoftPrueba.API.Middleware;

/// <summary>
/// Filtro de acción global: por cada parámetro del action que tenga un
/// <see cref="IValidator{T}"/> registrado en el contenedor de DI, ejecuta
/// la validación automáticamente antes de llegar al controlador.
/// Esto evita llamar "validator.Validate(dto)" manualmente en cada método
/// de cada controlador (DRY, Cross-Cutting Concern).
/// </summary>
public class ValidationFilter : IAsyncActionFilter
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationFilter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument is null) continue;

            var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
            if (_serviceProvider.GetService(validatorType) is IValidator validator)
            {
                var validationContext = new ValidationContext<object>(argument);
                var result = await validator.ValidateAsync(validationContext);
                if (!result.IsValid)
                {
                    throw new ValidationException(result.Errors);
                }
            }
        }

        await next();
    }
}
