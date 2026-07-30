using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AudisoftPrueba.Infrastructure.Persistence;

namespace AudisoftPrueba.Infrastructure.Repositories;

public class ProfesorRepository : GenericRepository<Profesor>, IProfesorRepository
{
    public ProfesorRepository(AppDbContext context) : base(context)
    {
    }
}
