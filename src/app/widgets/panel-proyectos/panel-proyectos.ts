import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-panel-proyectos',
  imports:[],
  templateUrl: './panel-proyectos.html',
  styleUrls: ['./panel-proyectos.css']
})
export class PanelProyectos {
  proyectos: string[] = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3'];
  @Output() proyectoSeleccionado = new EventEmitter<string>();

  agregarProyecto() {
    const nuevoNombre = `Proyecto ${this.proyectos.length + 1}`;
    this.proyectos.push(nuevoNombre);
  }

  seleccionarProyecto(nombre: string) {
    this.proyectoSeleccionado.emit(nombre);
  }

  eliminarProyecto(index: number) {
    this.proyectos.splice(index, 1);
  }

}
