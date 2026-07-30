import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';

/**
 * Traduce un HttpErrorResponse (incluyendo el payload del
 * ExceptionHandlingMiddleware del backend, con errores de validación
 * por campo) a un único mensaje legible para mostrar en una alerta.
 */
export function extractErrorMessage(error: HttpErrorResponse): string {
  const apiError = error.error as ApiError | undefined;

  if (apiError?.errors) {
    const detalles = Object.values(apiError.errors).flat().join(' ');
    return detalles || apiError.message;
  }

  if (apiError?.message) {
    return apiError.message;
  }

  return 'No fue posible completar la operación. Verifique su conexión con el servidor.';
}
