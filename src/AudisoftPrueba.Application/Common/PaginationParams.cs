namespace AudisoftPrueba.Application.Common;

/// <summary>
/// Parámetros de consulta para paginación. Encapsula las reglas de
/// límites (máx. 100 registros por página) para que ningún controlador
/// tenga que reimplementarlas.
/// </summary>
public class PaginationParams
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value switch
        {
            <= 0 => 10,
            > MaxPageSize => MaxPageSize,
            _ => value
        };
    }

    /// <summary>Texto libre opcional para filtrar por nombre.</summary>
    public string? Search { get; set; }
}
