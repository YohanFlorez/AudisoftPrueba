import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { EstudianteService } from '../../core/services/estudiante.service';
import { AlertService } from '../../core/services/alert.service';
import { Estudiante } from '../../core/models/estudiante.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { extractErrorMessage } from '../../core/utils/error.util';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { SearchBoxComponent } from '../../shared/components/search-box/search-box.component';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';
import { EstudianteFormModalComponent } from './estudiante-form-modal/estudiante-form-modal.component';
import { EstudianteDetailModalComponent } from './estudiante-detail-modal/estudiante-detail-modal';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    SearchBoxComponent,
    IsAdminDirective,
    EstudianteFormModalComponent,
    EstudianteDetailModalComponent
  ],
  templateUrl: './estudiantes.component.html'
})
export class EstudiantesComponent implements OnInit {
  paged?: PagedResult<Estudiante>;
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  searchTerm = '';

  showModal = false;
  estudianteAEditar: Estudiante | null = null;

  showDetailModal = false;
  estudianteIdSeleccionado: number | null = null;

  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly alert: AlertService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.estudianteService.getPaged(this.pageNumber, this.pageSize, this.searchTerm || undefined).subscribe({
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

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.pageNumber = 1;
    this.load();
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.load();
  }

  openDetail(estudiante: Estudiante): void {
    this.estudianteIdSeleccionado = estudiante.id;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.estudianteIdSeleccionado = null;
  }

  openCreate(): void {
    this.estudianteAEditar = null;
    this.showModal = true;
  }

  openEdit(estudiante: Estudiante): void {
    this.estudianteAEditar = estudiante;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSaved(): void {
    this.showModal = false;
    this.load();
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
