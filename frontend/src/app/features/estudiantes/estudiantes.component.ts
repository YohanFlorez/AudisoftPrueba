import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EstudianteService } from '../../core/services/estudiante.service';
import { AlertService } from '../../core/services/alert.service';
import { Estudiante } from '../../core/models/estudiante.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { extractErrorMessage } from '../../core/utils/error.util';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, IsAdminDirective],
  templateUrl: './estudiantes.component.html'
})
export class EstudiantesComponent implements OnInit {
  paged?: PagedResult<Estudiante>;
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  showModal = false;
  isEditing = false;
  form: FormGroup;
  private editingId: number | null = null;


  showDetailModal = false;
  selectedEstudiante: Estudiante | null = null;
  loadingDetail = false;

  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly alert: AlertService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.estudianteService.getPaged(this.pageNumber, this.pageSize).subscribe({
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

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.load();
  }

  openDetail(estudiante: Estudiante): void {
    this.showDetailModal = true;
    this.loadingDetail = true;
    this.selectedEstudiante = null;

    this.estudianteService.getById(estudiante.id).subscribe({
      next: (data) => {
        this.selectedEstudiante = data;
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
    this.selectedEstudiante = null;
  }

  openCreate(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(estudiante: Estudiante): void {
    this.isEditing = true;
    this.editingId = estudiante.id;
    this.form.setValue({ nombre: estudiante.nombre });
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

    const dto = { nombre: this.form.value.nombre };

    const request$ = this.isEditing && this.editingId
      ? this.estudianteService.update(this.editingId, dto)
      : this.estudianteService.create(dto);

    request$.subscribe({
      next: () => {
        this.showModal = false;
        this.alert.success(this.isEditing ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  async remove(estudiante: Estudiante): Promise<void> {
    const confirmed = await this.alert.confirmDelete(`el estudiante "${estudiante.nombre}"`);
    if (!confirmed) return;

    this.estudianteService.delete(estudiante.id).subscribe({
      next: () => {
        this.alert.success('Estudiante eliminado correctamente');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }
}
