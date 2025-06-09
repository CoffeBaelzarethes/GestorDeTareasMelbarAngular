import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-integrantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-integrantes.html',
  styleUrls: ['./panel-integrantes.css'],
})
export class PanelIntegrantes {
  nombreProyecto = 'NombreProyecto';
  integrantes: string[] = ['DuckyPoderoso', 'IvánPinocho', 'JulioRompeRaquetas3000', 'JuanCabezón' ,'PedroElMariguano'];
  nuevoIntegrante: string = '';

  eliminarIntegrante(nombre: string): void {
    this.integrantes = this.integrantes.filter(i => i !== nombre);
  }

  agregarIntegrante(): void {
    const nombre = this.nuevoIntegrante.trim();
    if (nombre && !this.integrantes.includes(nombre)) {
      this.integrantes.push(nombre);
    }
    this.nuevoIntegrante = '';
  }
}
