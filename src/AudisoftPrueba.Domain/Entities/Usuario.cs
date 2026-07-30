using AudisoftPrueba.Domain.Common;

namespace AudisoftPrueba.Domain.Entities;

public class Usuario : BaseEntity
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "Usuario"; // "Admin" | "Usuario"
}