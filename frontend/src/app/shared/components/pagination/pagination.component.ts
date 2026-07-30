import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de paginación reutilizable. Se usa en las 3 pantallas de
 * listado (Estudiantes, Profesores, Notas) para no duplicar el markup
 * ni la lógica de navegación entre páginas (DRY).
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() pageNumber = 1;
  @Input() totalPages = 1;
  @Input() hasPreviousPage = false;
  @Input() hasNextPage = false;
  @Input() totalCount = 0;

  @Output() pageChange = new EventEmitter<number>();

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }
    this.pageChange.emit(page);
  }
}
