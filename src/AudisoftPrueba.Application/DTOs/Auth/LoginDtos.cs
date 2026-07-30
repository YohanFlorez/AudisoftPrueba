using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudisoftPrueba.Application.DTOs.Auth
{
    public record LoginDto(string NombreUsuario, string Password);

    public record LoginResponseDto(string Token, string NombreUsuario, string Rol, DateTime ExpiraEn);
}
