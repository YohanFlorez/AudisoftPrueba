# Prueba Técnica .NET — AudiSoft Consulting

CRUD de **Estudiantes**, **Profesores** y **Notas**, con:

- **Backend**: ASP.NET Core 8 Web API, arquitectura por capas (Domain / Application / Infrastructure / API), EF Core, principios SOLID, patrón Repository + Unit of Work, validaciones con FluentValidation, middleware global de manejo de excepciones y autenticación/autorización con JWT (roles `Admin` / `Usuario`).
- **Frontend**: Angular 18 (standalone components), Bootstrap 5, SweetAlert2, con guards de rutas y control de acceso por rol.
- **Base de datos**: SQL Server (migraciones de EF Core o script SQL alternativo en `database/schema.sql`).

> Documentación ampliada (arquitectura, principios SOLID aplicados y evidencia de funcionamiento con capturas) disponible en **"Documento de instalación.docx"**, entregado junto a este código.

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

## Requisitos previos

- [.NET SDK 8.0](https://dotnet.microsoft.com/download) o superior
- [Node.js 18](https://nodejs.org) o superior, y npm
- Angular CLI 18 (`npm install -g @angular/cli`)
- SQL Server (LocalDB, Express o Developer Edition), o cualquier otro motor adaptando la cadena de conexión
- Opcional: una herramienta tipo Postman para probar la API (la API ya incluye Swagger)

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

## Instalación — Backend (.NET 8)

### 1. Restaurar dependencias

```bash
cd src/AudisoftPrueba.API
dotnet restore
```

### 2. Crear la base de datos

Hay dos formas equivalentes; se puede usar cualquiera de las dos:

**Opción A — Migraciones de Entity Framework (recomendada):**

```bash
dotnet tool install --global dotnet-ef   # si no está instalado
cd src/AudisoftPrueba.API
dotnet ef migrations add InitialCreate --project ../AudisoftPrueba.Infrastructure
dotnet ef database update
```

**Opción B — Script SQL directo:**

Ejecutar el archivo `database/schema.sql` en SQL Server Management Studio (o con `sqlcmd`) contra la instancia indicada en `appsettings.json`.

### 3. Configurar la cadena de conexión

Editar `src/AudisoftPrueba.API/appsettings.json` y ajustar `DefaultConnection` según el motor y la instancia de SQL Server disponibles. Por defecto apunta a LocalDB:

```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AudisoftPruebaDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```

También se debe configurar la sección `Jwt` para la emisión de tokens:

```json
"Jwt": {
  "Secret": "<clave-secreta-larga>",
  "Issuer": "AudisoftPrueba",
  "ExpiresHours": "8"
}
```

Si no se especifica `ExpiresHours`, el token expira por defecto a las 8 horas.

### 4. Ejecutar la API

```bash
dotnet run
```

La API queda disponible en la URL indicada por la consola (por ejemplo `https://localhost:7000`). Swagger se sirve automáticamente en `/swagger` en entorno de desarrollo, permitiendo probar cada endpoint sin necesidad de Postman.

## Instalación — Frontend (Angular 18)

```bash
cd frontend
npm install
```

Antes de levantar el frontend, verificar que `src/environments/environment.ts` apunte al puerto real que asignó `dotnet run` al backend:

```ts
apiUrl: 'https://localhost:7000/api' // ajustar el puerto si es distinto
```

```bash
ng serve -o
```

La aplicación se abre automáticamente en `http://localhost:4200`. El menú superior permite navegar entre Estudiantes, Profesores y Notas.

## Modelo de datos

| Tabla | Columnas |
|---|---|
| Estudiante | Id (PK), Nombre |
| Profesor | Id (PK), Nombre |
| Nota | Id (PK), Nombre, Valor, IdProfesor (FK → Profesor), IdEstudiante (FK → Estudiante) |
| Usuarios | Id (PK), NombreUsuario, PasswordHash, Rol |

Restricciones de llave foránea nombradas explícitamente en el modelo de EF Core:

- `FK_Nota_Profesor_IdProfesor`
- `FK_Nota_Estudiante_IdEstudiante`

El servicio de Nota valida la existencia de ambas referencias antes de guardar, devolviendo un mensaje de negocio claro (HTTP 400) en vez de dejar que sea la base de datos quien rechace la operación.

## Endpoints del API REST

Los tres recursos (`estudiantes`, `profesores`, `notas`) exponen el mismo contrato:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/{recurso}?pageNumber=1&pageSize=10` | Lista paginada |
| GET | `/api/{recurso}/{id}` | Obtiene un registro por Id |
| POST | `/api/{recurso}` | Crea un nuevo registro |
| PUT | `/api/{recurso}/{id}` | Actualiza un registro existente |
| DELETE | `/api/{recurso}/{id}` | Elimina un registro |

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Autentica un usuario existente y devuelve el token JWT junto con sus datos básicos |
| POST | `/api/auth/register` | Registra un nuevo usuario y devuelve el token JWT para iniciar sesión automáticamente |

## Autenticación y autorización (JWT)

El sistema incorpora un módulo de autenticación basado en JWT con autorización por roles (`Admin` y `Usuario`):

- **Admin**: acceso completo — crear, modificar y eliminar.
- **Usuario**: solo puede visualizar los registros, tanto en la API como en el frontend.

El token es firmado con HMAC-SHA256 e incluye como claims el Id del usuario, su nombre de usuario y su rol.

En el frontend, `AuthService` centraliza el flujo de autenticación, almacena el token y los datos del usuario en `localStorage`, y dos route guards (`authGuard`, `adminGuard`) protegen el acceso a las rutas según el estado de sesión y el rol.

## Arquitectura y principios SOLID

El backend se organiza en cuatro proyectos independientes dentro de la misma solución (Domain, Application, Infrastructure, API), aplicando:

- **SRP**: cada clase tiene una única responsabilidad (repositorios, servicios, controladores, configuraciones de EF separadas por entidad).
- **OCP**: `CrudServiceBase<T>` y `CrudControllerBase<T>` permiten agregar nuevos recursos sin modificar las clases base.
- **LSP**: cualquier implementación de `IGenericRepository<T>` o `ICrudService<T>` es sustituible sin romper el comportamiento esperado.
- **ISP**: interfaces específicas por recurso (`IEstudianteRepository`, `IProfesorRepository`, `INotaRepository`) en lugar de una interfaz genérica única.
- **DIP**: los controladores y servicios dependen de abstracciones (Domain/Application), nunca directamente de Entity Framework.

## Contenido del repositorio entregado

- `src/` — Solución completa de .NET (Domain, Application, Infrastructure, API)
- `database/schema.sql` — Script SQL alternativo con tablas, llaves foráneas y datos de ejemplo
- `frontend/` — Proyecto Angular completo (sin `node_modules` ni `dist`)
- `README.md` — Este documento, con instrucciones de arranque
- `AudisoftPrueba.sln` — Solución de Visual Studio
- Repositorio GitHub: https://github.com/YohanFlorez/AudisoftPrueba

## Documentación adicional

Para el detalle completo de arquitectura, justificación de los principios SOLID aplicados y evidencia de funcionamiento (capturas de pantalla del frontend en ejecución), ver **"Documento de instalación.docx"** entregado junto con este código.