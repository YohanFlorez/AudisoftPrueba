using AudisoftPrueba.Application.Common;

namespace AudisoftPrueba.Application.Interfaces;


public interface ICrudService<TReadDto, TCreateDto, TUpdateDto>
{
    Task<TReadDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<PagedResult<TReadDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);

    Task<TReadDto> CreateAsync(TCreateDto dto, CancellationToken cancellationToken = default);

    Task<TReadDto> UpdateAsync(int id, TUpdateDto dto, CancellationToken cancellationToken = default);

    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
