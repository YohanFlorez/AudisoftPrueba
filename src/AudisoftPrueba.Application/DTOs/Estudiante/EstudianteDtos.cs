namespace AudisoftPrueba.Application.DTOs.Estudiante;


public record EstudianteDto(int Id, string Nombre);


public record EstudianteCreateDto(string Nombre);


public record EstudianteUpdateDto(string Nombre);
