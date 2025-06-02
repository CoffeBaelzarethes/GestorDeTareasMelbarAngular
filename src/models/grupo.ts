export interface Grupo {
    id: number,
    nombre: string,
    Proyecto_IdProyecto: number
}

export interface GrupoCreateDTO {
    nombre: string,
    Proyecto_IdProyecto: number
}