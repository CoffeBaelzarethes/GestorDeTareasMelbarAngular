import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 




@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'GestorDeTareasMelbarAngular';
}
