export interface Nota {
  id: number;
  nombre: string;
  valor: number;
  idProfesor: number;
  profesorNombre: string;
  idEstudiante: number;
  estudianteNombre: string;
}

export interface NotaInput {
  nombre: string;
  valor: number;
  idProfesor: number;
  idEstudiante: number;
}
