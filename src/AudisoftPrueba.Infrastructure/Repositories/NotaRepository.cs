using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AudisoftPrueba.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AudisoftPrueba.Infrastructure.Repositories;

public class NotaRepository : GenericRepository<Nota>, INotaRepository
{
    public NotaRepository(AppDbContext context) : base(context)
    {
    }

    // Sobreescribimos la query base para siempre traer Profesor y Estudiante
    // incluidos: así el DTO de lectura puede mostrar sus nombres sin
    // llamadas adicionales desde el frontend.
    protected override IQueryable<Nota> Query =>
        DbSet.Include(n => n.Profesor).Include(n => n.Estudiante);

    public async Task<bool> EstudianteExisteAsync(int idEstudiante, CancellationToken cancellationToken = default) =>
        await Context.Estudiantes.AnyAsync(e => e.Id == idEstudiante, cancellationToken);

    public async Task<bool> ProfesorExisteAsync(int idProfesor, CancellationToken cancellationToken = default) =>
        await Context.Profesores.AnyAsync(p => p.Id == idProfesor, cancellationToken);

    public async Task<bool> TieneNotasProfesorAsync(
    int idProfesor,
    CancellationToken cancellationToken = default)
    {
        return await Context.Notas
            .AnyAsync(n => n.IdProfesor == idProfesor, cancellationToken);
    }

    public async Task<bool> TieneNotasEstudianteAsync(
        int idEstudiante,
        CancellationToken cancellationToken = default)
    {
        return await Context.Notas
            .AnyAsync(n => n.IdEstudiante == idEstudiante, cancellationToken);
    }
}
