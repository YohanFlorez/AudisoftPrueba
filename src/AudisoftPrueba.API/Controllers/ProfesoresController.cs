using AudisoftPrueba.Application.DTOs.Profesor;
using AudisoftPrueba.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AudisoftPrueba.API.Controllers;

[Route("api/profesores")]
public class ProfesoresController : CrudControllerBase<ProfesorDto, ProfesorCreateDto, ProfesorUpdateDto>
{
    public ProfesoresController(IProfesorService service) : base(service)
    {
    }
}
