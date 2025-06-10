export interface Proyecto {
    idProyecto: number,
    nombre: string,
    fecha_creacion: Date
}

export interface ProyectoCreateDTO {
    nombre: string,
    fecha_creacion: Date
}

export interface ProyectoUpdateDTO {
    nombre: string
}