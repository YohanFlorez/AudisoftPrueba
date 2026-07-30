namespace AudisoftPrueba.Application.DTOs.Nota;

/// <summary>
/// DTOS
/// </summary>
public record NotaDto(
    int Id,
    string Nombre,
    decimal Valor,
    int IdProfesor,
    string ProfesorNombre,
    int IdEstudiante,
    string EstudianteNombre);

/// <summary>DTO para crear una Nota.</summary>
public record NotaCreateDto(string Nombre, decimal Valor, int IdProfesor, int IdEstudiante);

/// <summary>DTO para actualizar una Nota.</summary>
public record NotaUpdateDto(string Nombre, decimal Valor, int IdProfesor, int IdEstudiante);
