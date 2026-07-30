/* =========================================================================
   Prueba Técnica .NET - AudiSoft Consulting
   Script de creación de base de datos (alternativa a EF Core Migrations)
   Motor: SQL Server
   ========================================================================= */

IF DB_ID('AudisoftPruebaDb') IS NULL
BEGIN
    CREATE DATABASE AudisoftPruebaDb;
END
GO

USE AudisoftPruebaDb;
GO

-- =========================================================================
-- Tabla: Estudiante
-- =========================================================================
IF OBJECT_ID('dbo.Nota', 'U') IS NOT NULL DROP TABLE dbo.Nota;
IF OBJECT_ID('dbo.Estudiante', 'U') IS NOT NULL DROP TABLE dbo.Estudiante;
IF OBJECT_ID('dbo.Profesor', 'U') IS NOT NULL DROP TABLE dbo.Profesor;
GO

CREATE TABLE dbo.Estudiante (
    Id      INT IDENTITY(1,1) NOT NULL,
    Nombre  NVARCHAR(150)     NOT NULL,
    CONSTRAINT PK_Estudiante PRIMARY KEY CLUSTERED (Id)
);
GO

CREATE INDEX IX_Estudiante_Nombre ON dbo.Estudiante(Nombre);
GO

-- =========================================================================
-- Tabla: Profesor
-- =========================================================================
CREATE TABLE dbo.Profesor (
    Id      INT IDENTITY(1,1) NOT NULL,
    Nombre  NVARCHAR(150)     NOT NULL,
    CONSTRAINT PK_Profesor PRIMARY KEY CLUSTERED (Id)
);
GO

CREATE INDEX IX_Profesor_Nombre ON dbo.Profesor(Nombre);
GO

-- =========================================================================
-- Tabla: Nota (con llaves foráneas hacia Profesor y Estudiante)
-- =========================================================================
CREATE TABLE dbo.Nota (
    Id            INT IDENTITY(1,1) NOT NULL,
    Nombre        NVARCHAR(150)     NOT NULL,
    Valor         DECIMAL(4,2)      NOT NULL,
    IdProfesor    INT               NOT NULL,
    IdEstudiante  INT               NOT NULL,
    CONSTRAINT PK_Nota PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_Nota_Profesor_IdProfesor
        FOREIGN KEY (IdProfesor) REFERENCES dbo.Profesor(Id)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Nota_Estudiante_IdEstudiante
        FOREIGN KEY (IdEstudiante) REFERENCES dbo.Estudiante(Id)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT CK_Nota_Valor CHECK (Valor >= 0 AND Valor <= 5)
);
GO

CREATE INDEX IX_Nota_IdProfesor ON dbo.Nota(IdProfesor);
CREATE INDEX IX_Nota_IdEstudiante ON dbo.Nota(IdEstudiante);
GO

-- =========================================================================
-- Datos de ejemplo (seed) - opcional, útil para probar el API de inmediato
-- =========================================================================
INSERT INTO dbo.Estudiante (Nombre) VALUES
    (N'Juan Pérez'),
    (N'María Gómez'),
    (N'Carlos Rodríguez');

INSERT INTO dbo.Profesor (Nombre) VALUES
    (N'Laura Martínez'),
    (N'Andrés Torres');

INSERT INTO dbo.Nota (Nombre, Valor, IdProfesor, IdEstudiante) VALUES
    (N'Primer Corte - Matemáticas', 4.5, 1, 1),
    (N'Primer Corte - Matemáticas', 3.8, 1, 2),
    (N'Segundo Corte - Historia',   4.2, 2, 1),
    (N'Segundo Corte - Historia',   4.9, 2, 3);
GO
