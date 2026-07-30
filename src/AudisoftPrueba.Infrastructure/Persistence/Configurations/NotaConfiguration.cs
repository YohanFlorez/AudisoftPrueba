using AudisoftPrueba.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AudisoftPrueba.Infrastructure.Persistence.Configurations;

public class NotaConfiguration : IEntityTypeConfiguration<Nota>
{
    public void Configure(EntityTypeBuilder<Nota> builder)
    {
        builder.ToTable("Nota");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Nombre)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(n => n.Valor)
            .IsRequired()
            .HasColumnType("decimal(4,2)");

        // Constraint de llave foránea explícita hacia Profesor.
        builder.HasOne(n => n.Profesor)
            .WithMany(p => p.Notas)
            .HasForeignKey(n => n.IdProfesor)
            .HasConstraintName("FK_Nota_Profesor_IdProfesor")
            .OnDelete(DeleteBehavior.Restrict);

        // Constraint de llave foránea explícita hacia Estudiante.
        builder.HasOne(n => n.Estudiante)
            .WithMany(e => e.Notas)
            .HasForeignKey(n => n.IdEstudiante)
            .HasConstraintName("FK_Nota_Estudiante_IdEstudiante")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(n => n.IdProfesor);
        builder.HasIndex(n => n.IdEstudiante);
    }
}
