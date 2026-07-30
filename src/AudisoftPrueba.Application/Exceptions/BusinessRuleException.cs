namespace AudisoftPrueba.Application.Exceptions;

/// <summary>
/// Se lanza cuando se viola una regla de negocio (p. ej. una llave foránea
/// referencia un registro inexistente). El middleware global la traduce
/// a un HTTP 400.
/// </summary>
public class BusinessRuleException : Exception
{
    public BusinessRuleException(string message) : base(message)
    {
    }
}
