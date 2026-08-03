using AudisoftPrueba.Application.Common;
using AudisoftPrueba.Application.DTOs.Nota;
using AudisoftPrueba.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AudisoftPrueba.API.Controllers;

[Route("api/notas")]
public class NotasController : CrudControllerBase<NotaDto, NotaCreateDto, NotaUpdateDto>
{
    private readonly INotaService _notaService;

    public NotasController(INotaService service) : base(service)
    {
        _notaService = service;
    }

    public override async Task<ActionResult<PagedResult<NotaDto>>> GetPaged(
        [FromQuery] PaginationParams pagination, CancellationToken cancellationToken)
    {
        var filters = new NotaFilterParams
        {
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize,
            Nombre = Request.Query["nombre"].FirstOrDefault(),
            Valor = decimal.TryParse(Request.Query["valor"], out var valor) ? valor : null,
            IdEstudiante = int.TryParse(Request.Query["idEstudiante"], out var idEst) ? idEst : null,
            IdProfesor = int.TryParse(Request.Query["idProfesor"], out var idProf) ? idProf : null
        };

        var result = await _notaService.GetPagedAsync(filters, cancellationToken);
        return Ok(result);
    }
}