export interface Tarea {
  idTarea: number;
  nombre: string;
  estado: number;
  vencimiento?: Date;
  nota?: string;
  grupo_idGrupo: number;
}

export interface TareaCreateDTO {
  nombre: string,
  estado: number;
  vencimiento?: Date;
  nota?: string;
  grupo_idGrupo: number;
}