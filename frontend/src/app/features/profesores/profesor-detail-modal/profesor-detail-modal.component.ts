import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../../../core/services/profesor.service';
import { AlertService } from '../../../core/services/alert.service';
import { Profesor } from '../../../core/models/profesor.model';
import { extractErrorMessage } from '../../../core/utils/error.util';

/**
 * Modal de detalle de un profesor. Recibe el id y hace su propia
 * carga (getById), manejando su estado de loading de forma aislada.
 *
 * Uso:
 *   <app-profesor-detail-modal
 *     *ngIf="showDetailModal"
 *     [profesorId]="idSeleccionado"
 *     (closed)="showDetailModal = false">
 *   </app-profesor-detail-modal>
 */
@Component({
  selector: 'app-profesor-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesor-detail-modal.component.html'
})
export class ProfesorDetailModalComponent implements OnChanges {
  @Input({ required: true }) profesorId!: number;
  @Output() closed = new EventEmitter<void>();

  profesor: Profesor | null = null;
  loading = false;

  constructor(
    private readonly profesorService: ProfesorService,
    private readonly alert: AlertService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profesorId']) {
      this.load();
    }
  }

  private load(): void {
    this.loading = true;
    this.profesor = null;

    this.profesorService.getById(this.profesorId).subscribe({
      next: (data) => {
        this.profesor = data;
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
