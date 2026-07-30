import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from './base-crud.service';
import { Profesor, ProfesorInput } from '../models/profesor.model';

@Injectable({ providedIn: 'root' })
export class ProfesorService extends BaseCrudService<Profesor, ProfesorInput> {
  protected readonly resourceUrl = `${environment.apiUrl}/profesores`;

  constructor(http: HttpClient) {
    super(http);
  }
}
