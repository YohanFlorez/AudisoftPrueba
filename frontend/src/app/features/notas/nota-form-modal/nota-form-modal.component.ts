import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NotaService } from '../../../core/services/nota.service';
import { AlertService } from '../../../core/services/alert.service';
import { Nota } from '../../../core/models/nota.model';
import { Estudiante } from '../../../core/models/estudiante.model';
import { Profesor } from '../../../core/models/profesor.model';
import { extractErrorMessage } from '../../../core/utils/error.util';

@Component({
  selector: 'app-nota-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nota-form-modal.component.html'
})
export class NotaFormModalComponent implements OnChanges {
  @Input() nota: Nota | null = null;
  @Input() estudiantes: Estudiante[] = [];
  @Input() profesores: Profesor[] = [];

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private readonly notaService: NotaService,
    private readonly alert: AlertService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      valor: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      idProfesor: [null, [Validators.required]],
      idEstudiante: [null, [Validators.required]]
    });
  }

  get isEditing(): boolean {
    return !!this.nota;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['nota']) return;

    if (this.nota) {
      this.form.setValue({
        nombre: this.nota.nombre,
        valor: this.nota.valor,
        idProfesor: this.nota.idProfesor,
        idEstudiante: this.nota.idEstudiante
      });
    } else {
      this.form.reset();
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const dto = {
      nombre: raw.nombre,
      valor: Number(raw.valor),
      idProfesor: Number(raw.idProfesor),
      idEstudiante: Number(raw.idEstudiante)
    };

    const request$ = this.isEditing && this.nota
      ? this.notaService.update(this.nota.id, dto)
      : this.notaService.create(dto);

    request$.subscribe({
      next: () => {
        this.alert.success(this.isEditing ? 'Nota actualizada correctamente' : 'Nota creada correctamente');
        this.saved.emit();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  close(): void {
    this.cancelled.emit();
  }
}
