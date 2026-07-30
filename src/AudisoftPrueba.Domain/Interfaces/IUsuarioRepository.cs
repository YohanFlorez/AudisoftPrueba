using AudisoftPrueba.Domain.Entities;

namespace AudisoftPrueba.Domain.Interfaces;

/// <summary>
/// Repositorio específico de Usuario. Agrega la búsqueda por nombre de
/// usuario, necesaria para el login, sin romper el contrato genérico.
/// </summary>
public interface IUsuarioRepository : IGenericRepository<Usuario>
{
    Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario, CancellationToken cancellationToken = default);
}