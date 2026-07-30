using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudisoftPrueba.Application.DTOs.Auth
{
    public record RegisterDto(string NombreUsuario, string Password, string Rol);
}
