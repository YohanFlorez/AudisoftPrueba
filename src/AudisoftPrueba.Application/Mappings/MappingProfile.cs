using AudisoftPrueba.Application.DTOs.Estudiante;
using AudisoftPrueba.Application.DTOs.Nota;
using AudisoftPrueba.Application.DTOs.Profesor;
using AudisoftPrueba.Domain.Entities;
using AutoMapper;

namespace AudisoftPrueba.Application.Mappings;

/// <summary>
/// Mantener el mapeo en un solo
/// lugar evita duplicar lógica de conversión en cada servicio .
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Estudiante, EstudianteDto>();
        CreateMap<EstudianteCreateDto, Estudiante>();
        CreateMap<EstudianteUpdateDto, Estudiante>();

        CreateMap<Profesor, ProfesorDto>();
        CreateMap<ProfesorCreateDto, Profesor>();
        CreateMap<ProfesorUpdateDto, Profesor>();

        CreateMap<Nota, NotaDto>()
            .ForCtorParam("ProfesorNombre", opt => opt.MapFrom(src => src.Profesor != null ? src.Profesor.Nombre : string.Empty))
            .ForCtorParam("EstudianteNombre", opt => opt.MapFrom(src => src.Estudiante != null ? src.Estudiante.Nombre : string.Empty));
        CreateMap<NotaCreateDto, Nota>();
        CreateMap<NotaUpdateDto, Nota>();
    }
}
