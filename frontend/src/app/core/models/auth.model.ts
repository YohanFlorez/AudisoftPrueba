// core/models/auth.model.ts
export interface LoginRequest {
  nombreUsuario: string;
  password: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  password: string;
  rol: 'Admin' | 'Usuario';
}

export interface AuthResponse {
  token: string;
  nombreUsuario: string;
  rol: string;
  expiraEn: string;
}
