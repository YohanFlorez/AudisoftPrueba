using AudisoftPrueba.Application.Common;
using AudisoftPrueba.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AudisoftPrueba.API.Controllers;

/// <summary>
/// Controlador base genérico
/// </summary>
[ApiController]
public abstract class CrudControllerBase<TReadDto, TCreateDto, TUpdateDto> : ControllerBase
{
    private readonly ICrudService<TReadDto, TCreateDto, TUpdateDto> _service;
    protected CrudControllerBase(ICrudService<TReadDto, TCreateDto, TUpdateDto> service)
    {
        _service = service;
    }

    // Lectura: cualquier usuario autenticado (Admin o Usuario)
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PagedResult<TReadDto>>> GetPaged(
        [FromQuery] PaginationParams pagination, CancellationToken cancellationToken)
    {
        var result = await _service.GetPagedAsync(pagination, cancellationToken);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TReadDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _service.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    // Escritura: solo Admin
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TReadDto>> Create(TCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _service.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = GetId(created) }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TReadDto>> Update(int id, TUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _service.UpdateAsync(id, dto, cancellationToken);
        return Ok(updated);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _service.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    private static int GetId(TReadDto dto)
    {
        var property = typeof(TReadDto).GetProperty("Id")
            ?? throw new InvalidOperationException($"{typeof(TReadDto).Name} debe exponer una propiedad Id.");
        return (int)property.GetValue(dto)!;
    }
}