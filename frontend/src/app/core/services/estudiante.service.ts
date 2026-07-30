import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from './base-crud.service';
import { Estudiante, EstudianteInput } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService extends BaseCrudService<Estudiante, EstudianteInput> {
  protected readonly resourceUrl = `${environment.apiUrl}/estudiantes`;

  constructor(http: HttpClient) {
    super(http);
  }
}
