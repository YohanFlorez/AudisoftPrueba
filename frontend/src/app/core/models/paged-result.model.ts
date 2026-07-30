/**
 * Espejo del PagedResult<T> del backend. Se usa en todas las listas
 * paginadas del frontend (Estudiantes, Profesores, Notas).
 */
export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
