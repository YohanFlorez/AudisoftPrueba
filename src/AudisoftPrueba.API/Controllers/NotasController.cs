using AudisoftPrueba.Application.DTOs.Nota;
using AudisoftPrueba.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AudisoftPrueba.API.Controllers;

[Route("api/notas")]
public class NotasController : CrudControllerBase<NotaDto, NotaCreateDto, NotaUpdateDto>
{
    public NotasController(INotaService service) : base(service)
    {
    }
}
