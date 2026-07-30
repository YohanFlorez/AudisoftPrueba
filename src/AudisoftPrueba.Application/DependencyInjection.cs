using System.Reflection;
using AudisoftPrueba.Application.Interfaces;
using AudisoftPrueba.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace AudisoftPrueba.Application;

/// <summary>
/// Punto único de registro de servicios de la capa Application en el
/// contenedor de Inyección de Dependencias.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IEstudianteService, EstudianteService>();
        services.AddScoped<IProfesorService, ProfesorService>();
        services.AddScoped<INotaService, NotaService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
