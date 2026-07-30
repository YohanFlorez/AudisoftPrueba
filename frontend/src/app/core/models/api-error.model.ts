/** Espejo del payload de error que devuelve el ExceptionHandlingMiddleware del backend. */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]> | null;
}
