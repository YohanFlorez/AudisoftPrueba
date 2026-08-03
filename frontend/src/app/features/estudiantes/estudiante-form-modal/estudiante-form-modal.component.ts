import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { AlertService } from '../../../core/services/alert.service';
import { Estudiante } from '../../../core/models/estudiante.model';
import { extractErrorMessage } from '../../../core/utils/error.util';
import { soloLetrasValidator } from '../../../shared/validators/Solo letras.validator';
import { BloquearNumerosDirective } from '../../../shared/directives/bloquear-numeros.directive';

/**
 * Modal de creación/edición de estudiante.
 * Encapsula su propio formulario y llamada al servicio.
 *
 * Uso:
 *   <app-estudiante-form-modal
 *     *ngIf="showModal"
 *     [estudiante]="estudianteAEditar"
 *     (saved)="onSaved()"
 *     (cancelled)="showModal = false">
 *   </app-estudiante-form-modal>
 */
@Component({
  selector: 'app-estudiante-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BloquearNumerosDirective],
  templateUrl: './estudiante-form-modal.component.html'
})
export class EstudianteFormModalComponent implements OnChanges {
  /** Si viene null/undefined, el modal opera en modo "Crear". Si trae un estudiante, modo "Editar". */
  @Input() estudiante: Estudiante | null = null;

  /** Emite cuando el guardado fue exitoso, para que el padre recargue la lista y cierre el modal. */
  @Output() saved = new EventEmitter<void>();
  /** Emite cuando el usuario cancela/cierra sin guardar. */
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly alert: AlertService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150), soloLetrasValidator]]
    });
  }

  get isEditing(): boolean {
    return !!this.estudiante;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estudiante']) {
      if (this.estudiante) {
        this.form.setValue({ nombre: this.estudiante.nombre });
      } else {
        this.form.reset();
      }
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = { nombre: this.form.value.nombre };

    const request$ = this.isEditing && this.estudiante
      ? this.estudianteService.update(this.estudiante.id, dto)
      : this.estudianteService.create(dto);

    request$.subscribe({
      next: () => {
        this.alert.success(this.isEditing ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente');
        this.saved.emit();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  close(): void {
    this.cancelled.emit();
  }
}
