# Prueba Técnica .NET — AudiSoft Consulting

CRUD de **Estudiantes**, **Profesores** y **Notas** con:

- **Backend**: ASP.NET Core 8 Web API, arquitectura por capas (Domain / Application / Infrastructure / API), EF Core, principios SOLID.
- **Frontend**: Angular 18 (standalone components), Bootstrap 5, SweetAlert2.
- **Base de datos**: SQL Server (migraciones de EF Core o script SQL alternativo en `database/schema.sql`).

## Estructura del repositorio

```
AudisoftPrueba/
├── AudisoftPrueba.sln
├── src/
│   ├── AudisoftPrueba.Domain          # Entidades e interfaces (sin dependencias externas)
│   ├── AudisoftPrueba.Application     # DTOs, servicios, validadores, mapeos
│   ├── AudisoftPrueba.Infrastructure  # EF Core, repositorios, Unit of Work
│   └── AudisoftPrueba.API             # Controladores REST, Program.cs, middleware
├── database/
│   └── schema.sql                     # Script SQL alternativo a las migraciones
└── frontend/                          # Aplicación Angular
```

Ver el documento **"Documento de instalación.docx"** entregado junto a este código para instrucciones paso a paso.

## Arranque rápido

```bash
# Backend
cd src/AudisoftPrueba.API
dotnet restore
dotnet ef database update   # o ejecutar database/schema.sql manualmente
dotnet run

# Frontend (en otra terminal)
cd frontend
npm install
ng serve -o
```
