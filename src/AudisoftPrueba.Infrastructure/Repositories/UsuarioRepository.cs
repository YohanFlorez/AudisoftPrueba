using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AudisoftPrueba.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AudisoftPrueba.Infrastructure.Repositories;

public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario, CancellationToken cancellationToken = default)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == nombreUsuario, cancellationToken);
    }
}