using System.Reflection;
using AudisoftPrueba.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AudisoftPrueba.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Estudiante> Estudiantes => Set<Estudiante>();
    public DbSet<Profesor> Profesores => Set<Profesor>();
    public DbSet<Nota> Notas => Set<Nota>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Aplica automáticamente todas las clases IEntityTypeConfiguration<T>
        // del ensamblado, manteniendo el mapeo de cada entidad en su propio
        // archivo (SRP) en vez de un único OnModelCreating gigante.
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
