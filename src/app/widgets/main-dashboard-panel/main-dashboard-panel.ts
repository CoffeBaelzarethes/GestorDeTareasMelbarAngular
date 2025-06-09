import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { TaskContainer } from '../../task-container/task-container';
import { GruposService } from '../../grupos-service';
import { Grupo } from '../../../models/grupo';

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

  constructor(
    private gruposService: GruposService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gruposService.grupos$.subscribe(grupos => {
      this.zone.run(() => {
        this.grupos = grupos;
        this.loaded = true;
      });
      this.cdr.detectChanges();
    });

    this.gruposService.cargarGrupos();
  }

  onDeleteGroup(group: Grupo) {
    this.gruposService.deleteGrupo(group);
  }

  tryToCreateGroup(): void {
    this.gruposService.addGrupo({ nombre: "Nuevo Grupo", Proyecto_IdProyecto: 1 });
  }

  trackByGrupoId(index: number, grupo: Grupo): number {
    return grupo.id;
  }
}
