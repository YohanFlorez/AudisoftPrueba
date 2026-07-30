using AudisoftPrueba.Application.DTOs.Profesor;
using AudisoftPrueba.Application.Exceptions;
using AudisoftPrueba.Application.Interfaces;
using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AutoMapper;

namespace AudisoftPrueba.Application.Services;

public class ProfesorService
    : CrudServiceBase<Profesor, ProfesorDto, ProfesorCreateDto, ProfesorUpdateDto>, IProfesorService
{
    public ProfesorService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork.Profesores, unitOfWork, mapper, "Profesor")
    {
    }

    public override async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var profesor = await Repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Profesor", id);

        if (await UnitOfWork.Notas.TieneNotasProfesorAsync(id, cancellationToken))
            throw new BusinessRuleException(
                "No se puede eliminar el profesor porque tiene notas asociadas.");

        Repository.Remove(profesor);
        await UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}