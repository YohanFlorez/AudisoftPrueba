import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Barra de búsqueda genérica y reutilizable.
 * Emite el término de búsqueda ya "debounced" y sin espacios extra.
 *
 * Uso:
 *   <app-search-box
 *     placeholder="Buscar por nombre..."
 *     (searchChange)="onSearch($event)">
 *   </app-search-box>
 */
@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Input() debounceMs = 400;
  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl<string>('', { nonNullable: true });
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceMs),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => this.searchChange.emit(value.trim()));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clear(): void {
    this.searchControl.setValue('');
  }
}
