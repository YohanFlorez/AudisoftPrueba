import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';

/**
 * Servicio CRUD genérico: centraliza las llamadas HTTP estándar hacia
 * cualquier recurso REST (GET paginado, GET por id, POST, PUT, DELETE).
 * Cada servicio concreto (EstudianteService, ProfesorService, NotaService)
 * solo indica el "resourcePath", evitando duplicar código HTTP (DRY / SRP).
 */
export abstract class BaseCrudService<TRead, TCreate, TUpdate = TCreate> {
  protected abstract readonly resourceUrl: string;

  constructor(protected readonly http: HttpClient) {}

  getPaged(pageNumber: number, pageSize: number, search?: string): Observable<PagedResult<TRead>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PagedResult<TRead>>(this.resourceUrl, { params });
  }

  getById(id: number): Observable<TRead> {
    return this.http.get<TRead>(`${this.resourceUrl}/${id}`);
  }

  create(dto: TCreate): Observable<TRead> {
    return this.http.post<TRead>(this.resourceUrl, dto);
  }

  update(id: number, dto: TUpdate): Observable<TRead> {
    return this.http.put<TRead>(`${this.resourceUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
