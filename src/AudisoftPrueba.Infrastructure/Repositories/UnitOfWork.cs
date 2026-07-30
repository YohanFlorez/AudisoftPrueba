using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AudisoftPrueba.Infrastructure.Persistence;

namespace AudisoftPrueba.Infrastructure.Repositories;

/// <summary>
/// Implementación de <see cref="IUnitOfWork"/>. Crea los repositorios de
/// forma perezosa (lazy) sobre el mismo DbContext, garantizando que todas
/// las operaciones de una request compartan la misma transacción implícita.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private IEstudianteRepository? _estudiantes;
    private IProfesorRepository? _profesores;
    private INotaRepository? _notas;
    private IUsuarioRepository? _usuarios;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IEstudianteRepository Estudiantes => _estudiantes ??= new EstudianteRepository(_context);
    public IProfesorRepository Profesores => _profesores ??= new ProfesorRepository(_context);
    public INotaRepository Notas => _notas ??= new NotaRepository(_context);

    public IUsuarioRepository Usuarios => _usuarios ??= new UsuarioRepository(_context);

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _context.SaveChangesAsync(cancellationToken);
}
