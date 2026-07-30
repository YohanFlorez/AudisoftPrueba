import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Centraliza el uso de SweetAlert2. Ningún componente llama a Swal
 * directamente: todos dependen de esta abstracción (SRP + DIP), de modo
 * que si el día de mañana se cambia la librería de alertas, solo se
 * modifica este archivo.
 */
@Injectable({ providedIn: 'root' })
export class AlertService {
  success(message: string): void {
    Swal.fire({
      icon: 'success',
      title: message,
      timer: 1800,
      showConfirmButton: false
    });
  }

  error(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un error',
      text: message
    });
  }

  async confirmDelete(entityLabel: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: `¿Eliminar ${entityLabel}?`,
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });

    return result.isConfirmed;
  }
}
