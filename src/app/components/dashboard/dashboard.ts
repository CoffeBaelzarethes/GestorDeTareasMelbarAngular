import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MainDashboardPanel } from '../../widgets/main-dashboard-panel/main-dashboard-panel';
import { PanelIntegrantes } from '../../widgets/panel-integrantes/panel-integrantes';
import { PanelProyectos } from '../../widgets/panel-proyectos/panel-proyectos';
import { ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../../models/proyecto';
import { ProyectosService } from '../../proyectos-service';

@Component({
  selector: 'app-dashboard',
  imports: [MainDashboardPanel, PanelIntegrantes, PanelProyectos],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [ProyectosService]
})
export class Dashboard implements OnInit {
  @Input() selectedProyectoEventEmitter!: EventEmitter<Proyecto>;
  @Input() onDeleteProyectEventEmitter!: EventEmitter<number>;
  @ViewChild(MainDashboardPanel) mainDashboardPanel!: MainDashboardPanel;

  integrante_id: number = 0;
  username: string = "";

  constructor(
    private route: ActivatedRoute, 
    private proyectosService: ProyectosService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.integrante_id = parseInt(this.route.snapshot.paramMap.get("id_integrante")!, 10);
    this.username = this.route.snapshot.paramMap.get("username")!;
  }

  onSelectProyect(proyect: Proyecto) {
    this.mainDashboardPanel.onSelectProyect(proyect);
  }

  onDeleteProyect(proyectId: number) {
    this.mainDashboardPanel.onDeleteProyect(proyectId);
  }

}
