using AudisoftPrueba.Application.DTOs.Nota;
using AudisoftPrueba.Application.Exceptions;
using AudisoftPrueba.Application.Interfaces;
using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;
using AutoMapper;

namespace AudisoftPrueba.Application.Services;

public class NotaService : CrudServiceBase<Nota, NotaDto, NotaCreateDto, NotaUpdateDto>, INotaService
{
    private readonly INotaRepository _notaRepository;

    public NotaService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork.Notas, unitOfWork, mapper, "Nota")
    {
        _notaRepository = unitOfWork.Notas;
    }

    protected override async Task ValidateBusinessRulesAsync(NotaCreateDto dto, CancellationToken cancellationToken)
    {
        await ValidarReferenciasAsync(dto.IdProfesor, dto.IdEstudiante, cancellationToken);
    }

    protected override async Task ValidateBusinessRulesAsync(NotaUpdateDto dto, CancellationToken cancellationToken)
    {
        await ValidarReferenciasAsync(dto.IdProfesor, dto.IdEstudiante, cancellationToken);
    }

    /// <summary>
    /// Valida que el profesor y el estudiante referenciados existan antes de
    /// intentar persistir la nota
    /// </summary>
    private async Task ValidarReferenciasAsync(int idProfesor, int idEstudiante, CancellationToken cancellationToken)
    {
        if (!await _notaRepository.ProfesorExisteAsync(idProfesor, cancellationToken))
        {
            throw new BusinessRuleException($"El profesor con id {idProfesor} no existe.");
        }

        if (!await _notaRepository.EstudianteExisteAsync(idEstudiante, cancellationToken))
        {
            throw new BusinessRuleException($"El estudiante con id {idEstudiante} no existe.");
        }
    }
}
