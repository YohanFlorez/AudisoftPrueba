namespace AudisoftPrueba.Application.Exceptions;

/// <summary>
/// Se lanza cuando un recurso solicitado no existe. El middleware global
/// la traduce a un HTTP 404.
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string entity, int id)
        : base($"{entity} con id {id} no fue encontrado.")
    {
    }
}
