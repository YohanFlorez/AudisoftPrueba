using AudisoftPrueba.Domain.Entities;

namespace AudisoftPrueba.Domain.Interfaces;

public interface INotaRepository : IGenericRepository<Nota>
{
    Task<bool> EstudianteExisteAsync(int idEstudiante, CancellationToken cancellationToken = default);

    Task<bool> ProfesorExisteAsync(int idProfesor, CancellationToken cancellationToken = default);

    // Nuevos métodos
    Task<bool> TieneNotasProfesorAsync(int idProfesor, CancellationToken cancellationToken = default);

    Task<bool> TieneNotasEstudianteAsync(int idEstudiante, CancellationToken cancellationToken = default);
}