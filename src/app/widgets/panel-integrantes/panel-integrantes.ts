import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntegrantesService } from '../../integrantes-service';
import { Integrante } from '../../../models/integrante';
import { Proyecto } from '../../../models/proyecto';

@Component({
  selector: 'app-panel-integrantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-integrantes.html',
  styleUrls: ['./panel-integrantes.css'],
  providers: [IntegrantesService],
})
export class PanelIntegrantes implements OnInit {
  nombreProyecto = 'Integrantes: ';
  integrantes: Integrante[] = [];
  nuevoIntegrante: string = '';
  proyecto?: Proyecto;
  @Input() username: string = '';

  constructor(
    private integrantesService: IntegrantesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.integrantesService.integrantes$.subscribe((integrantes) => {
      this.integrantes = integrantes;

      this.cdr.detectChanges();
      console.log('Cargando Integrantes');
      console.log(integrantes);
    });
  }

  eliminarIntegrante(nombre: string): void {
    if (this.proyecto != null && nombre != this.username) {
      console.log("IdProyecto: " + this.proyecto.idProyecto + " Nombre: " + nombre)
      this.integrantesService
        .eliminarRelacionIntegranteProyecto(this.proyecto.idProyecto, nombre)
        .subscribe(() => {
          //this.integrantesService
            //.deleteIntegranteByName(nombre)
            //.subscribe(() => {
              //this.integrantesService.cargarIntegrantesPorProyecto(
                //this.proyecto!.idProyecto
              //);
            //});
            this.integrantesService.cargarIntegrantesPorProyecto(
                this.proyecto!.idProyecto
              );
        });
    }
  }

  onSelectProyect(proyecto: Proyecto) {
    this.integrantesService.cargarIntegrantesPorProyecto(proyecto.idProyecto);
    this.proyecto = proyecto;
    console.log(proyecto);
  }

  agregarIntegrante(nombreIntegrante: string): void {
    this.integrantesService
      .verificarExistenciaPorNombre(nombreIntegrante)
      .subscribe((existe) => {
        if (existe) {
          console.log('Ya existe un integrante con ese nombre.');

          var exists:boolean = false;
          this.integrantes.forEach(i =>{
            if(i.nombre === nombreIntegrante)
            {
              exists = true;
              return;
            }
          })

          if (this.proyecto != null && !exists) {
            this.integrantesService
              .vincularIntegranteProyecto(
                nombreIntegrante,
                this.proyecto.idProyecto
              )
              .subscribe(() => {
                this.integrantesService.cargarIntegrantesPorProyecto(
                  this.proyecto!.idProyecto
                );
              });
          }
          // Mostrar mensaje al usuario
        } else {
          this.integrantesService
            .addIntegrante({ nombre: nombreIntegrante })
            .subscribe((integrante) => {
              if (this.proyecto != null) {
                this.integrantesService
                  .vincularIntegranteProyecto(
                    nombreIntegrante,
                    this.proyecto.idProyecto
                  )
                  .subscribe(() => {
                    this.integrantesService.cargarIntegrantesPorProyecto(
                      this.proyecto!.idProyecto
                    );
                  });
              }
            });
          console.log('El nombre está disponible.');
          
        }
      });
  }
}
