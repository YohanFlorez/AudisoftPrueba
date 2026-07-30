namespace AudisoftPrueba.Domain.Common;

/// <summary>
/// Entidad base. Centraliza la llave primaria para que todas las
/// entidades del dominio compartan un contrato común (DRY).
/// </summary>
public abstract class BaseEntity
{
    public int Id { get; set; }
}
