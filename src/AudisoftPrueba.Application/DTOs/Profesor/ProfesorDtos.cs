namespace AudisoftPrueba.Application.DTOs.Profesor;

/// <summary>DTO de lectura de Profesor.</summary>
public record ProfesorDto(int Id, string Nombre);

/// <summary>DTO para crear un Profesor.</summary>
public record ProfesorCreateDto(string Nombre);

/// <summary>DTO para actualizar un Profesor.</summary>
public record ProfesorUpdateDto(string Nombre);
