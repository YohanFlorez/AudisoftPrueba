namespace AudisoftPrueba.Domain.Interfaces;

/// <summary>
/// Patrón Unit of Work: agrupa los repositorios y expone un único punto
/// para confirmar los cambios en una misma transacción.
/// </summary>
public interface IUnitOfWork
{
    IEstudianteRepository Estudiantes { get; }
    IProfesorRepository Profesores { get; }
    INotaRepository Notas { get; }
    IUsuarioRepository Usuarios { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
