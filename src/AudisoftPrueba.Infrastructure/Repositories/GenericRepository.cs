using System.Linq.Expressions;
using AudisoftPrueba.Domain.Common;
using AudisoftPrueba.Domain.Interfaces;
using AudisoftPrueba.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AudisoftPrueba.Infrastructure.Repositories;

/// <summary>
/// Implementación genérica de <see cref="IGenericRepository{T}"/> usando
/// Entity Framework Core. Las clases concretas heredan de esta para no
/// reimplementar el CRUD básico (DRY), y pueden sobreescribir el
/// <see cref="DbSet{T}"/> query base vía <see cref="Query"/> si necesitan
/// Include de navegaciones.
/// </summary>
public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext Context;
    protected readonly DbSet<T> DbSet;

    public GenericRepository(AppDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    /// <summary>
    /// Punto de extensión: por defecto no aplica Includes. Los repositorios
    /// concretos (p. ej. NotaRepository) lo sobreescriben para traer las
    /// navegaciones necesarias.
    /// </summary>
    protected virtual IQueryable<T> Query => DbSet.AsQueryable();

    public virtual async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await Query.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    // ------------------------------------------------------------------
    // NUEVO: método pensado exclusivamente para operaciones de escritura
    // (Update). A diferencia de GetByIdAsync:
    //   - NO aplica los Include() definidos en "Query" de repositorios
    //     concretos (evita traer navegaciones "viejas" que EF podría
    //     priorizar sobre las FKs escalares nuevas al hacer SaveChanges).
    //   - SÍ trackea la entidad (no usa AsNoTracking), que es lo correcto
    //     para poder modificarla y persistir los cambios.
    // ------------------------------------------------------------------
    public virtual async Task<T?> GetByIdForUpdateAsync(int id, CancellationToken cancellationToken = default) =>
        await DbSet.FindAsync(new object[] { id }, cancellationToken);

    public virtual async Task<(IReadOnlyList<T> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<T, bool>>? filter = null,
        CancellationToken cancellationToken = default)
    {
        var query = Query.AsNoTracking();
        if (filter is not null)
        {
            query = query.Where(filter);
        }
        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        return (items, totalCount);
    }

    public virtual async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await Query.AsNoTracking().ToListAsync(cancellationToken);

    public virtual async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default) =>
        await DbSet.AnyAsync(e => e.Id == id, cancellationToken);

    public virtual async Task AddAsync(T entity, CancellationToken cancellationToken = default) =>
        await DbSet.AddAsync(entity, cancellationToken);

    public virtual void Update(T entity) => DbSet.Update(entity);

    public virtual void Remove(T entity) => DbSet.Remove(entity);

    public async Task<bool> AnyAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(predicate, cancellationToken);
    }
}