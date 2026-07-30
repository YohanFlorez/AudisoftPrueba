import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../../core/services/profesor.service';
import { AlertService } from '../../core/services/alert.service';
import { Profesor } from '../../core/models/profesor.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { extractErrorMessage } from '../../core/utils/error.util';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, IsAdminDirective],
  templateUrl: './profesores.component.html'
})
export class ProfesoresComponent implements OnInit {
  paged?: PagedResult<Profesor>;
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  showModal = false;
  isEditing = false;
  form: FormGroup;
  private editingId: number | null = null;

  showDetailModal = false;
  selectedProfesor: Profesor | null = null;
  loadingDetail = false;

  constructor(
    private readonly profesorService: ProfesorService,
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
    this.profesorService.getPaged(this.pageNumber, this.pageSize).subscribe({
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

  openDetail(profesor: Profesor): void {
    this.showDetailModal = true;
    this.loadingDetail = true;
    this.selectedProfesor = null;

    this.profesorService.getById(profesor.id).subscribe({
      next: (data) => {
        this.selectedProfesor = data;
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
    this.selectedProfesor = null;
  }

  openCreate(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(profesor: Profesor): void {
    this.isEditing = true;
    this.editingId = profesor.id;
    this.form.setValue({ nombre: profesor.nombre });
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
      ? this.profesorService.update(this.editingId, dto)
      : this.profesorService.create(dto);

    request$.subscribe({
      next: () => {
        this.showModal = false;
        this.alert.success(this.isEditing ? 'Profesor actualizado correctamente' : 'Profesor creado correctamente');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }

  async remove(profesor: Profesor): Promise<void> {
    const confirmed = await this.alert.confirmDelete(`el profesor "${profesor.nombre}"`);
    if (!confirmed) return;

    this.profesorService.delete(profesor.id).subscribe({
      next: () => {
        this.alert.success('Profesor eliminado correctamente');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.alert.error(extractErrorMessage(err))
    });
  }
}
