using AudisoftPrueba.Domain.Common;

namespace AudisoftPrueba.Domain.Entities;

/// <summary>
/// Representa a un estudiante del sistema académico.
/// </summary>
public class Estudiante : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Notas asociadas al estudiante (relación 1 a muchos).
    /// </summary>
    public ICollection<Nota> Notas { get; set; } = new List<Nota>();
}
