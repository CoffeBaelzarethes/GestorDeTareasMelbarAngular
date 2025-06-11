import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { TaskContainer } from '../../task-container/task-container';
import { GruposService } from '../../grupos-service';
import { Grupo } from '../../../models/grupo';
import { Proyecto } from '../../../models/proyecto';

@Component({
  selector: 'app-main-dashboard-panel',
  standalone: true,
  imports: [TaskContainer, CommonModule],
  templateUrl: './main-dashboard-panel.html',
  styleUrls: ['./main-dashboard-panel.css'],
  providers: [GruposService]
})
export class MainDashboardPanel implements OnInit {

  loaded: boolean = false;
  grupos!: Grupo[];
  proyect: Proyecto | null = null; 

  constructor(
    private gruposService: GruposService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gruposService.grupos$.subscribe(grupos => {
      if(this.proyect != null) {
        this.grupos = [...grupos.filter(g => g.Proyecto_IdProyecto == this.proyect!.idProyecto)];
        this.loaded = true;
        //this.cdr.detectChanges();

        console.log("Cargando proyectos");
      } else {
        this.loaded = false;
      }

      this.cdr.detectChanges();
    });
  }

  onSelectProyect(proyect: Proyecto) {
    this.proyect = proyect;

    this.gruposService.cargarGrupos();
  }

  onDeleteProyect(proyectId: number) {
    if(this.proyect != null) {
      if(proyectId == this.proyect.idProyecto) {
        this.gruposService.cargarGrupos();
        this.proyect = null;
      }
    }
  }

  onDeleteGroup(group: Grupo) {
    this.gruposService.deleteGrupo(group);
  }

  tryToCreateGroup(): void {
    if(this.proyect != null) {
      this.gruposService.addGrupo({ nombre: "Nuevo Grupo", Proyecto_IdProyecto: this.proyect.idProyecto });
    }
  }

  trackByGrupoId(index: number, grupo: Grupo): number {
    return grupo.id;
  }
}
