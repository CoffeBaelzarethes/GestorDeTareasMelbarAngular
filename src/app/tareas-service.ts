import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { Tarea } from '../models/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareasService implements OnInit  {

  httpClient = inject(HttpClient);
  tareas: Tarea[]

  constructor() {
    this.tareas = [
      { id: Math.floor(Math.random() * 1000), nombre: "Estar", estado: 0, vencimiento: new Date('2025-05-29 10:30:00') },
      { id: Math.floor(Math.random() * 1000), nombre: "Mirar", estado: 2 },
      { id: Math.floor(Math.random() * 1000), nombre: "Pensar", estado: 3 },
      { id: Math.floor(Math.random() * 1000), nombre: "Tocar", estado: 1 },
    ];
  }

  getTareas(): Tarea[] {
    return this.tareas;
  }

  addTarea(tarea: Tarea): Tarea[] {
    this.tareas.push(tarea);

    return this.tareas;
  }

  updateGrupo(tareaId: number, tarea: Tarea) {
    
  }

  deleteTarea(taskId: number): Tarea[] {
    this.tareas = this.tareas.filter((t) => t.id != taskId);
    return this.tareas;
  }

  ngOnInit(): void {
      
  }
}
