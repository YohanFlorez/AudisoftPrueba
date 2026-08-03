import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../../../core/services/profesor.service';
import { AlertService } from '../../../core/services/alert.service';
import { Profesor } from '../../../core/models/profesor.model';
import { extractErrorMessage } from '../../../core/utils/error.util';
import { soloLetrasValidator } from '../../../shared/validators/Solo letras.validator';
import { BloquearNumerosDirective } from '../../../shared/directives/bloquear-numeros.directive';

/**
 * Modal de creación/edición de profesor.
 * Encapsula su propio formulario y llamada al servicio.
 *
 * Uso:
 *   <app-profesor-form-modal
 *     *ngIf="showModal"
 *     [profesor]="profesorAEditar"
 *     (saved)="onSaved()"
 *     (cancelled)="showModal = false">
 *   </app-profesor-form-modal>
 */
@Component({
  selector: 'app-profesor-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BloquearNumerosDirective],
  templateUrl: './profesor-form-modal.component.html'
})
export class ProfesorFormModalComponent implements OnChanges {
  /** Si viene null/undefined, el modal opera en modo "Crear". Si trae un profesor, modo "Editar". */
  @Input() profesor: Profesor | null = null;

  /** Emite cuando el guardado fue exitoso, para que el padre recargue la lista y cierre el modal. */
  @Output() saved = new EventEmitter<void>();
  /** Emite cuando el usuario cancela/cierra sin guardar. */
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private readonly profesorService: ProfesorService,
    private readonly alert: AlertService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150), soloLetrasValidator]]
    });
  }

  get isEditing(): boolean {
    return !!this.profesor;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profesor']) {
      if (this.profesor) {
        this.form.setValue({ nombre: this.profesor.nombre });
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

    const request$ = this.isEditing && this.profesor
      ? this.profesorService.update(this.profesor.id, dto)
      : this.profesorService.create(dto);

    request$.subscribe({
      next: () => {
        this.alert.success(this.isEditing ? 'Profesor actualizado correctamente' : 'Profesor creado correctamente');
        this.saved.emit();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  close(): void {
    this.cancelled.emit();
  }
}
