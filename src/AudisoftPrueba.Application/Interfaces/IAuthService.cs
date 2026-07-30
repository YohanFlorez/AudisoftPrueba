using AudisoftPrueba.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudisoftPrueba.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken);

        Task<LoginResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken);
    }
}
