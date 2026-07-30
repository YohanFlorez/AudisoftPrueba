using System.Net;
using System.Text.Json;
using AudisoftPrueba.Application.Exceptions;
using FluentValidation;

namespace AudisoftPrueba.API.Middleware;

/// <summary>
/// Middleware centralizado de manejo de errores (Cross-Cutting Concern).
/// Evita repetir try/catch en cada controlador (DRY) y garantiza que toda
/// la API responda errores con un formato JSON consistente.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message, errors) = exception switch
        {
            NotFoundException => (HttpStatusCode.NotFound, exception.Message, (IDictionary<string, string[]>?)null),
            BusinessRuleException => (HttpStatusCode.BadRequest, exception.Message, null),
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                "Se encontraron errores de validación.",
                (IDictionary<string, string[]>?)validationEx.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())),
            _ => (HttpStatusCode.InternalServerError, "Ocurrió un error inesperado en el servidor.", null)
        };

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Error no controlado procesando {Method} {Path}",
                context.Request.Method, context.Request.Path);
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var payload = new
        {
            status = (int)statusCode,
            message,
            errors
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
