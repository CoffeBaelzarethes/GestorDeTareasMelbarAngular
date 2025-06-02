import { Injectable } from '@angular/core';
import { Estado } from '../models/estado';

@Injectable({
  providedIn: 'root'
})
export class TareaEstadosService {

  estados: Estado[];

  constructor() {
    this.estados = [
      { nombre: "No Completado", value: 0 },
      { nombre: "Completado", value: 1 },
      { nombre: "Casi Completado", value: 2 },
      { nombre: "Poco Completado", value: 3 },
    ];
  }

  getEstados() {
    return this.estados;
  }

}
