using AudisoftPrueba.Domain.Common;

namespace AudisoftPrueba.Domain.Entities;

/// <summary>
/// Representa la calificación (nota) que un profesor asigna a un estudiante.
/// </summary>
public class Nota : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public int IdProfesor { get; set; }
    public Profesor? Profesor { get; set; }

    public int IdEstudiante { get; set; }
    public Estudiante? Estudiante { get; set; }
}
