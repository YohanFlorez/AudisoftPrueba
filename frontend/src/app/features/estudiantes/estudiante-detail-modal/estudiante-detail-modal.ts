import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { AlertService } from '../../../core/services/alert.service';
import { Estudiante } from '../../../core/models/estudiante.model';
import { extractErrorMessage } from '../../../core/utils/error.util';

/**
 * Modal de detalle de un estudiante. Recibe el id y hace su propia
 * carga (getById), manejando su estado de loading de forma aislada.
 *
 * Uso:
 *   <app-estudiante-detail-modal
 *     *ngIf="showDetailModal"
 *     [estudianteId]="idSeleccionado"
 *     (closed)="showDetailModal = false">
 *   </app-estudiante-detail-modal>
 */
@Component({
  selector: 'app-estudiante-detail-modal',
  standalone: true,
  imports: [CommonModule],
 templateUrl: './estudiante-detail-modal.html'
})
export class EstudianteDetailModalComponent implements OnChanges {
  @Input({ required: true }) estudianteId!: number;
  @Output() closed = new EventEmitter<void>();

  estudiante: Estudiante | null = null;
  loading = false;

  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly alert: AlertService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estudianteId']) {
      this.load();
    }
  }

  private load(): void {
    this.loading = true;
    this.estudiante = null;

    this.estudianteService.getById(this.estudianteId).subscribe({
      next: (data) => {
        this.estudiante = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.alert.error(extractErrorMessage(err));
        this.close();
      }
    });
  }

  close(): void {
    this.closed.emit();
  }
}
