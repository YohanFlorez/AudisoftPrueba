using AudisoftPrueba.Application.Common;
using AudisoftPrueba.Application.Exceptions;
using AudisoftPrueba.Application.Interfaces;
using AudisoftPrueba.Domain.Common;
using AudisoftPrueba.Domain.Interfaces;
using AutoMapper;

namespace AudisoftPrueba.Application.Services;

/// <summary>
/// Implementación base para servicios CRUD De forma generica permitiendo la reutilización del mismo. 
/// </summary>
public abstract class CrudServiceBase<TEntity, TReadDto, TCreateDto, TUpdateDto>
    : ICrudService<TReadDto, TCreateDto, TUpdateDto>
    where TEntity : BaseEntity, new()
{
    protected readonly IGenericRepository<TEntity> Repository;
    protected readonly IUnitOfWork UnitOfWork;
    protected readonly IMapper Mapper;
    private readonly string _entityName;

    protected CrudServiceBase(
        IGenericRepository<TEntity> repository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        string entityName)
    {
        Repository = repository;
        UnitOfWork = unitOfWork;
        Mapper = mapper;
        _entityName = entityName;
    }

    public virtual async Task<TReadDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await Repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(_entityName, id);

        return Mapper.Map<TReadDto>(entity);
    }

    public virtual async Task<PagedResult<TReadDto>> GetPagedAsync(
        PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, total) = await Repository.GetPagedAsync(
            pagination.PageNumber, pagination.PageSize, cancellationToken: cancellationToken);

        return new PagedResult<TReadDto>
        {
            Items = Mapper.Map<IReadOnlyList<TReadDto>>(items),
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize,
            TotalCount = total
        };
    }

    public virtual async Task<TReadDto> CreateAsync(TCreateDto dto, CancellationToken cancellationToken = default)
    {
        await ValidateBusinessRulesAsync(dto, cancellationToken);

        var entity = Mapper.Map<TEntity>(dto);
        await Repository.AddAsync(entity, cancellationToken);
        await UnitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(entity.Id, cancellationToken);
    }

    public virtual async Task<TReadDto> UpdateAsync(int id, TUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await Repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(_entityName, id);

        await ValidateBusinessRulesAsync(dto, cancellationToken);

        Mapper.Map(dto, entity);
        Repository.Update(entity);
        await UnitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken);
    }

    public virtual async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await Repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(_entityName, id);

        Repository.Remove(entity);
        await UnitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Punto de extensión para reglas de negocio adicionales (por defecto no hace nada).
    /// </summary>
    protected virtual Task ValidateBusinessRulesAsync(TCreateDto dto, CancellationToken cancellationToken) =>
        Task.CompletedTask;

    /// <summary>
    /// Punto de extensión para reglas de negocio adicionales en actualización.
    /// </summary>
    protected virtual Task ValidateBusinessRulesAsync(TUpdateDto dto, CancellationToken cancellationToken) =>
        Task.CompletedTask;
}
