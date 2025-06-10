import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IntegrantesService } from '../../integrantes-service';
import { Integrante } from '../../../models/integrante';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule],
  providers: [IntegrantesService],
})
export class Login implements OnInit {
  @Input() username: string = '';
  integrantes!: Integrante[];

  constructor(
    private router: Router,
    private integrantesService: IntegrantesService
  ) {}

  ngOnInit(): void {
    this.integrantesService.integrantes$.subscribe({
      next: (integrantes) => {
        this.integrantes = integrantes;
      },
      error: (err) => console.error('Error al cargar integrante:', err),
    });

    this.integrantesService.cargarIntegrantes();
  }

  onLogin() {
    if (this.username.length != 0 && !this.username.includes(' ')) {

      var names = this.integrantes.map((i) => i.nombre);

      if (!names.includes(this.username)) {
        // Success
        this.integrantesService
          .addIntegrante({
            nombre: this.username,
          })
          .subscribe((newIntegrante) => {
            this.router.navigate(['/dashboard/' + newIntegrante.idIntegrante + "/" + this.username]);
          });
      } else {
        var filtered: Integrante[] = this.integrantes.filter(
          (i) => i.nombre === this.username
        );

        if (filtered.length != 0) {
          this.router.navigate(['/dashboard/' + filtered[0].idIntegrante + "/" + this.username]);
        }
      }
    }
    if (this.username.length == 0) {
      alert('Porfavor introduzca un nombre de usuario');
    } else if (this.username.includes(' ')) {
      alert(
        'Porfavor no escriba espacios en el nombre de usuario, sustituyalos por guiones bajos'
      );
    }
  }
}
