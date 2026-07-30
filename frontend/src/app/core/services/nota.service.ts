import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from './base-crud.service';
import { Nota, NotaInput } from '../models/nota.model';

@Injectable({ providedIn: 'root' })
export class NotaService extends BaseCrudService<Nota, NotaInput> {
  protected readonly resourceUrl = `${environment.apiUrl}/notas`;

  constructor(http: HttpClient) {
    super(http);
  }
}
