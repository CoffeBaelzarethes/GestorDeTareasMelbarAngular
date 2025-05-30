export interface Tarea {
  id: number;
  nombre: string;
  estado: number;
  vencimiento?: Date;
  nota?: string;
}