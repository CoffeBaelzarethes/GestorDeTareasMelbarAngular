import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskContainer } from '../task-container/task-container';
import { GruposService } from '../grupos-service';
import { Grupo } from '../../models/grupo';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-main-dashboard-panel',
  imports: [TaskContainer, CommonModule],
  templateUrl: './main-dashboard-panel.html',
  styleUrl: './main-dashboard-panel.css',
  providers: [GruposService]
})
export class MainDashboardPanel implements OnInit {

  loaded: boolean;
  grupos!: Grupo[];

  constructor(private gruposService: GruposService, private zone: NgZone, private cdr: ChangeDetectorRef) {
     this.loaded = false;
  }

  ngOnInit(): void {
    this.gruposService.grupos$.subscribe(grupos => {
      this.zone.run(() => {
        this.grupos = grupos;
        this.loaded = true;
      });
      this.cdr.detectChanges();
      console.log(grupos);
    });

    this.gruposService.cargarGrupos(); // <-- carga desde la API al iniciar
  }

  onDeleteGroup(group: Grupo) {
    //this.grupos = this.gruposService.deleteGrupo(group);
  }

  tryToCreateGroup(): void {
    /*this.grupos = this.gruposService.addGrupo({ 
      id: this.grupos.length, 
      nombre: "Prueba", 
      Proyecto_IdProyecto: 1 
    });*/
  }

  trackByGrupoId(index: number, grupo: Grupo): number {
    return grupo.id;
  }

}
