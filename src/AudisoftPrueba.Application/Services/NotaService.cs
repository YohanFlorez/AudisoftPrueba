using System.Linq.Expressions;
using AudisoftPrueba.Application.Common;
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

    public async Task<PagedResult<NotaDto>> GetPagedAsync(
        NotaFilterParams filters, CancellationToken cancellationToken = default)
    {
        var filter = BuildFilter(filters);

        var (items, total) = await Repository.GetPagedAsync(
            filters.PageNumber, filters.PageSize, filter: filter, cancellationToken: cancellationToken);

        return new PagedResult<NotaDto>
        {
            Items = Mapper.Map<IReadOnlyList<NotaDto>>(items),
            PageNumber = filters.PageNumber,
            PageSize = filters.PageSize,
            TotalCount = total
        };
    }

    private static Expression<Func<Nota, bool>>? BuildFilter(NotaFilterParams f)
    {
        Expression<Func<Nota, bool>>? filter = null;

        if (!string.IsNullOrWhiteSpace(f.Nombre))
        {
            var nombre = f.Nombre.Trim().ToLower();
            filter = Combine(filter, n => n.Nombre.ToLower().Contains(nombre));
        }

        if (f.Valor.HasValue)
        {
            filter = Combine(filter, n => n.Valor == f.Valor.Value);
        }

        if (f.IdEstudiante.HasValue)
        {
            filter = Combine(filter, n => n.IdEstudiante == f.IdEstudiante.Value);
        }

        if (f.IdProfesor.HasValue)
        {
            filter = Combine(filter, n => n.IdProfesor == f.IdProfesor.Value);
        }

        return filter;
    }

    private static Expression<Func<Nota, bool>> Combine(
        Expression<Func<Nota, bool>>? current, Expression<Func<Nota, bool>> next) =>
        current is null ? next : current.And(next);

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