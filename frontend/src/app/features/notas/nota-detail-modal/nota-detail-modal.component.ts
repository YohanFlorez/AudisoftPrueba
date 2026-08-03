import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotaService } from '../../../core/services/nota.service';
import { AlertService } from '../../../core/services/alert.service';
import { Nota } from '../../../core/models/nota.model';
import { extractErrorMessage } from '../../../core/utils/error.util';

@Component({
  selector: 'app-nota-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nota-detail-modal.component.html'
})
export class NotaDetailModalComponent implements OnChanges {
  @Input() notaId!: number;
  @Output() closed = new EventEmitter<void>();

  nota: Nota | null = null;
  loading = false;

  constructor(
    private readonly notaService: NotaService,
    private readonly alert: AlertService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notaId'] && this.notaId) {
      this.load();
    }
  }

  private load(): void {
    this.loading = true;
    this.nota = null;

    this.notaService.getById(this.notaId).subscribe({
      next: (data) => {
        this.nota = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.alert.error(extractErrorMessage(err));
        this.closed.emit();
      }
    });
  }

  close(): void {
    this.closed.emit();
  }
}
