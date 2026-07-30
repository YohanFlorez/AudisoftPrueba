using AudisoftPrueba.Application.DTOs.Estudiante;
using AudisoftPrueba.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AudisoftPrueba.API.Controllers;

[Route("api/estudiantes")]
public class EstudiantesController : CrudControllerBase<EstudianteDto, EstudianteCreateDto, EstudianteUpdateDto>
{
    public EstudiantesController(IEstudianteService service) : base(service)
    {
    }
}
