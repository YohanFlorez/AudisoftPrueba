using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AudisoftPrueba.Infrastructure.Persistence;

namespace AudisoftPrueba.Infrastructure.Repositories;

public class EstudianteRepository : GenericRepository<Estudiante>, IEstudianteRepository
{
    public EstudianteRepository(AppDbContext context) : base(context)
    {
    }
}
