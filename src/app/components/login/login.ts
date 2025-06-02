import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule]
})
export class Login {
  @Input() username: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.username.trim()) {
      // Simulate login success and navigate to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please enter a username.');
    }
  }
}