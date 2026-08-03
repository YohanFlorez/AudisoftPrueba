using AudisoftPrueba.Application.Common;
using AudisoftPrueba.Application.DTOs.Nota;

namespace AudisoftPrueba.Application.Interfaces;

public interface INotaService : ICrudService<NotaDto, NotaCreateDto, NotaUpdateDto>
{
    Task<PagedResult<NotaDto>> GetPagedAsync(NotaFilterParams filters, CancellationToken cancellationToken = default);
}