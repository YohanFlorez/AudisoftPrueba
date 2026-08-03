import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../../core/services/profesor.service';
import { AlertService } from '../../core/services/alert.service';
import { Profesor } from '../../core/models/profesor.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { extractErrorMessage } from '../../core/utils/error.util';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { SearchBoxComponent } from '../../shared/components/search-box/search-box.component';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';
import { ProfesorFormModalComponent } from './profesor-form-modal/profesor-form-modal.component';
import { ProfesorDetailModalComponent } from './profesor-detail-modal/profesor-detail-modal.component';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    SearchBoxComponent,
    IsAdminDirective,
    ProfesorFormModalComponent,
    ProfesorDetailModalComponent
  ],
  templateUrl: './profesores.component.html'
})
export class ProfesoresComponent implements OnInit {
  paged?: PagedResult<Profesor>;
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  searchTerm = '';

  showModal = false;
  profesorAEditar: Profesor | null = null;

  showDetailModal = false;
  profesorIdSeleccionado: number | null = null;

  constructor(
    private readonly profesorService: ProfesorService,
    private readonly alert: AlertService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.profesorService.getPaged(this.pageNumber, this.pageSize, this.searchTerm || undefined).subscribe({
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

  openDetail(profesor: Profesor): void {
    this.profesorIdSeleccionado = profesor.id;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.profesorIdSeleccionado = null;
  }

  openCreate(): void {
    this.profesorAEditar = null;
    this.showModal = true;
  }

  openEdit(profesor: Profesor): void {
    this.profesorAEditar = profesor;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSaved(): void {
    this.showModal = false;
    this.load();
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
