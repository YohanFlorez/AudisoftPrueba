using AudisoftPrueba.Application.DTOs.Auth;
using AudisoftPrueba.Application.Exceptions;
using AudisoftPrueba.Application.Interfaces;
using AudisoftPrueba.Domain.Entities;
using AudisoftPrueba.Domain.Interfaces;

namespace AudisoftPrueba.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(IUnitOfWork unitOfWork, IJwtTokenGenerator jwtTokenGenerator)
    {
        _unitOfWork = unitOfWork;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken)
    {
        var usuario = await _unitOfWork.Usuarios.GetByNombreUsuarioAsync(dto.NombreUsuario, cancellationToken)
            ?? throw new UnauthorizedException("Usuario o contraseña incorrectos.");

        var passwordValida = BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash);
        if (!passwordValida)
            throw new UnauthorizedException("Usuario o contraseña incorrectos.");

        var (token, expiraEn) = _jwtTokenGenerator.GenerateToken(usuario);

        return new LoginResponseDto(token, usuario.NombreUsuario, usuario.Rol, expiraEn);
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken)
    {
        var existente = await _unitOfWork.Usuarios.GetByNombreUsuarioAsync(dto.NombreUsuario, cancellationToken);
        if (existente != null)
            throw new BusinessRuleException("Ya existe un usuario con ese nombre.");

        var usuario = new Usuario
        {
            NombreUsuario = dto.NombreUsuario,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Rol = string.IsNullOrWhiteSpace(dto.Rol) ? "Usuario" : dto.Rol
        };

        await _unitOfWork.Usuarios.AddAsync(usuario, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var (token, expiraEn) = _jwtTokenGenerator.GenerateToken(usuario);

        return new LoginResponseDto(token, usuario.NombreUsuario, usuario.Rol, expiraEn);
    }
}