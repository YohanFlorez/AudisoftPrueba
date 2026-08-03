import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from './base-crud.service';
import { Nota, NotaInput } from '../models/nota.model';
import { PagedResult } from '../models/paged-result.model';

export interface NotaFilters {
  nombre?: string;
  valor?: number;
  idEstudiante?: number;
  idProfesor?: number;
}

@Injectable({ providedIn: 'root' })
export class NotaService extends BaseCrudService<Nota, NotaInput> {
  protected readonly resourceUrl = `${environment.apiUrl}/notas`;

  constructor(http: HttpClient) {
    super(http);
  }

  getPagedFiltered(pageNumber: number, pageSize: number, filters: NotaFilters): Observable<PagedResult<Nota>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (filters.nombre) {
      params = params.set('nombre', filters.nombre);
    }
    if (filters.valor !== undefined) {
      params = params.set('valor', filters.valor);
    }
    if (filters.idEstudiante) {
      params = params.set('idEstudiante', filters.idEstudiante);
    }
    if (filters.idProfesor) {
      params = params.set('idProfesor', filters.idProfesor);
    }

    return this.http.get<PagedResult<Nota>>(this.resourceUrl, { params });
  }
}
