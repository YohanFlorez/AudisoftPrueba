using AudisoftPrueba.Application.DTOs.Estudiante;
using AudisoftPrueba.Application.Exceptions;
using AudisoftPrueba.Application.Interfaces;
using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AutoMapper;
using System.Linq.Expressions;

namespace AudisoftPrueba.Application.Services;

public class EstudianteService
    : CrudServiceBase<Estudiante, EstudianteDto, EstudianteCreateDto, EstudianteUpdateDto>, IEstudianteService
{
    public EstudianteService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork.Estudiantes, unitOfWork, mapper, "Estudiante")
    {
    }

    public override async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var estudiante = await Repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Estudiante", id);

        if (await UnitOfWork.Notas.TieneNotasEstudianteAsync(id, cancellationToken))
            throw new BusinessRuleException(
                "No se puede eliminar el estudiante porque tiene notas asociadas.");

        Repository.Remove(estudiante);
        await UnitOfWork.SaveChangesAsync(cancellationToken);
    }
    protected override Expression<Func<Estudiante, bool>>? BuildSearchFilter(string search)
    {
        var normalized = search.ToLower();
        return e => e.Nombre.ToLower().Contains(normalized);
    }
}