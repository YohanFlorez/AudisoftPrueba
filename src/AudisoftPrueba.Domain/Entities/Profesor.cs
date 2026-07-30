using AudisoftPrueba.Domain.Common;

namespace AudisoftPrueba.Domain.Entities;

/// <summary>
/// Representa a un profesor del sistema académico.
/// </summary>
public class Profesor : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Notas registradas por el profesor (relación 1 a muchos).
    /// </summary>
    public ICollection<Nota> Notas { get; set; } = new List<Nota>();
}
