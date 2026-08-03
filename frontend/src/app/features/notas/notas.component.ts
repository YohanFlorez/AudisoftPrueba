import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotaService, NotaFilters } from '../../core/services/nota.service';
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
import { NotaFormModalComponent } from './nota-form-modal/nota-form-modal.component';
import { NotaDetailModalComponent } from './nota-detail-modal/nota-detail-modal.component';

const COMBO_PAGE_SIZE = 100;

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    IsAdminDirective,
    NotaFormModalComponent,
    NotaDetailModalComponent
  ],
  templateUrl: './notas.component.html'
})
export class NotasComponent implements OnInit, OnDestroy {
  paged?: PagedResult<Nota>;
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  estudiantes: Estudiante[] = [];
  profesores: Profesor[] = [];

  filterForm: FormGroup;
  private readonly destroy$ = new Subject<void>();

  showModal = false;
  selectedNota: Nota | null = null;

  showDetailModal = false;
  selectedNotaId: number | null = null;

  constructor(
    private readonly notaService: NotaService,
    private readonly estudianteService: EstudianteService,
    private readonly profesorService: ProfesorService,
    private readonly alert: AlertService,
    private readonly fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      nombre: [''],
      valor: [null],
      idEstudiante: [null],
      idProfesor: [null]
    });
  }

  ngOnInit(): void {
    this.load();
    this.loadCombos();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.load();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildFilters(): NotaFilters {
    const raw = this.filterForm.value;
    return {
      nombre: raw.nombre?.trim() || undefined,
      valor: raw.valor !== null && raw.valor !== '' ? Number(raw.valor) : undefined,
      idEstudiante: raw.idEstudiante ?? undefined,
      idProfesor: raw.idProfesor ?? undefined
    };
  }

  hasActiveFilters(): boolean {
    const f = this.buildFilters();
    return !!(f.nombre || f.valor !== undefined || f.idEstudiante || f.idProfesor);
  }

  clearFilters(): void {
    this.filterForm.reset({ nombre: '', valor: null, idEstudiante: null, idProfesor: null });
  }

  load(): void {
    this.loading = true;
    this.notaService.getPagedFiltered(this.pageNumber, this.pageSize, this.buildFilters()).subscribe({
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
    this.selectedNotaId = nota.id;
    this.showDetailModal = true;
  }

  onDetailClosed(): void {
    this.showDetailModal = false;
    this.selectedNotaId = null;
  }

  openCreate(): void {
    this.selectedNota = null;
    this.showModal = true;
  }

  openEdit(nota: Nota): void {
    this.selectedNota = nota;
    this.showModal = true;
  }

  onFormSaved(): void {
    this.showModal = false;
    this.load();
  }

  onFormCancelled(): void {
    this.showModal = false;
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
