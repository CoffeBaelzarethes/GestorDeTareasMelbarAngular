import { Component } from '@angular/core';
import { MainDashboardPanel } from '../main-dashboard-panel/main-dashboard-panel';

@Component({
  selector: 'app-dashboard',
  imports: [MainDashboardPanel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
