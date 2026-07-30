import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NotaService } from '../../core/services/nota.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { ProfesorService } from '../../core/services/profesor.service';
import { AlertService } from '../../core/services/alert.service';
import { Nota } from '../../core/models/nota.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { Profesor } from '../../core/models/profesor.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { extractErrorMessage } from '../../core/utils/error.util';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';

const COMBO_PAGE_SIZE = 100;

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, IsAdminDirective],
  templateUrl: './notas.component.html'
})
export class NotasComponent implements OnInit {
  paged?: PagedResult<Nota>;
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  estudiantes: Estudiante[] = [];
  profesores: Profesor[] = [];

  showModal = false;
  isEditing = false;
  form: FormGroup;
  private editingId: number | null = null;

  showDetailModal = false;
  selectedNota: Nota | null = null;
  loadingDetail = false;

  constructor(
    private readonly notaService: NotaService,
    private readonly estudianteService: EstudianteService,
    private readonly profesorService: ProfesorService,
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

  ngOnInit(): void {
    this.load();
    this.loadCombos();
  }

  load(): void {
    this.loading = true;
    this.notaService.getPaged(this.pageNumber, this.pageSize).subscribe({
      next: (result) => {
        this.paged = result;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.alert.error(extractErrorMessage(err));
      }
    });
  }

  private loadCombos(): void {
    forkJoin({
      estudiantes: this.estudianteService.getPaged(1, COMBO_PAGE_SIZE),
      profesores: this.profesorService.getPaged(1, COMBO_PAGE_SIZE)
    }).subscribe({
      next: ({ estudiantes, profesores }) => {
        this.estudiantes = estudiantes.items;
        this.profesores = profesores.items;
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.load();
  }

  openDetail(nota: Nota): void {
    this.showDetailModal = true;
    this.loadingDetail = true;
    this.selectedNota = null;

    this.notaService.getById(nota.id).subscribe({
      next: (data) => {
        this.selectedNota = data;
        this.loadingDetail = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loadingDetail = false;
        this.showDetailModal = false;
        this.alert.error(extractErrorMessage(err));
      }
    });
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedNota = null;
  }

  openCreate(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(nota: Nota): void {
    this.isEditing = true;
    this.editingId = nota.id;
    this.form.setValue({
      nombre: nota.nombre,
      valor: nota.valor,
      idProfesor: nota.idProfesor,
      idEstudiante: nota.idEstudiante
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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

    const request$ = this.isEditing && this.editingId
      ? this.notaService.update(this.editingId, dto)
      : this.notaService.create(dto);

    request$.subscribe({
      next: () => {
        this.showModal = false;
        this.alert.success(this.isEditing ? 'Nota actualizada correctamente' : 'Nota creada correctamente');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  async remove(nota: Nota): Promise<void> {
    const confirmed = await this.alert.confirmDelete(`la nota "${nota.nombre}"`);
    if (!confirmed) return;

    this.notaService.delete(nota.id).subscribe({
      next: () => {
        this.alert.success('Nota eliminada correctamente');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }
}
