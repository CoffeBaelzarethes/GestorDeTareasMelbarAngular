import { Component } from '@angular/core';
import { MainDashboardPanel } from '../../widgets/main-dashboard-panel/main-dashboard-panel';
import { PanelIntegrantes } from '../../widgets/panel-integrantes/panel-integrantes';
import { PanelProyectos } from '../../widgets/panel-proyectos/panel-proyectos';

@Component({
  selector: 'app-dashboard',
  imports: [MainDashboardPanel, PanelIntegrantes, PanelProyectos],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
