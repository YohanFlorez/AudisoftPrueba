import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment'; // ajusta la ruta si es distinta
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'audisoft_token';
const USER_KEY = 'audisoft_user';

export interface CurrentUser {
  nombreUsuario: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  // Permite que otros componentes (navbar, guards, etc.) reaccionen
  // en tiempo real cuando el usuario hace login o logout.
  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null>(
    this.getUserFromStorage()
  );
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(dto: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, dto).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRol(): string | null {
    return this.getUserFromStorage()?.rol ?? null;
  }

  getNombreUsuario(): string | null {
    return this.getUserFromStorage()?.nombreUsuario ?? null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    return this.getRol() === 'Admin';
  }

  /** Útil si en el futuro agregas más roles y no quieres hardcodear 'Admin' en todos lados */
  hasRole(...roles: string[]): boolean {
    const rol = this.getRol();
    return !!rol && roles.includes(rol);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    const user: CurrentUser = { nombreUsuario: res.nombreUsuario, rol: res.rol };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): CurrentUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false; // si el token no trae exp, no lo invalidamos aquí
      const expiryMs = payload.exp * 1000;
      return Date.now() >= expiryMs;
    } catch {
      // Si el token está corrupto o mal formado, lo tratamos como inválido
      return true;
    }
  }
}
