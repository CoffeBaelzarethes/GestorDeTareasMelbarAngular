import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Proyecto } from '../../../models/proyecto';
import { ProyectosService } from '../../proyectos-service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProyectoEntry } from '../proyecto-entry/proyecto-entry';
import { IntegrantesService } from '../../integrantes-service';
import { Integrante } from '../../../models/integrante';
import { IntegrantesProyectosService } from '../../integrantes-proyectos-service';
import { catchError, combineLatest, EMPTY, map, of, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-panel-proyectos',
  imports: [CommonModule, ProyectoEntry],
  templateUrl: './panel-proyectos.html',
  styleUrls: ['./panel-proyectos.css'],
  providers: [
    ProyectosService,
    IntegrantesService,
    IntegrantesProyectosService,
  ],
})
export class PanelProyectos implements OnInit {
  @Input() integranteId: number = 0;
  @Input() username: string = '';
  @Output() onDeleteProyectEventEmitter = new EventEmitter<number>();
  @Output() selectedProyectoEventEmitter = new EventEmitter<Proyecto>();

  proyectos: Proyecto[] = [];
  loaded: boolean = false;

  constructor(
    private proyectosService: ProyectosService,
    private integrantesService: IntegrantesService,
    private integrantesProyectosService: IntegrantesProyectosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  
    this.integrantesService.integrantes$
      .pipe(
        map((integrantes) =>
          integrantes.find((i) => i.idIntegrante == this.integranteId)
        ),
        switchMap((integrante) => {
          if (!integrante) return EMPTY;

          // primero carga los proyectos del integrante
          return this.integrantesProyectosService
            .cargarProyectos(this.integranteId)
            .pipe(
              catchError(err => {
                if (err.status === 404) {
                  return of([]); // devuelve un arreglo vacío si no hay proyectos
                }
                return throwError(() => err);
              }),
              switchMap(() =>
                combineLatest([
                  this.proyectosService.proyectos$,
                  this.integrantesProyectosService.integrantesProyectos$,
                ]).pipe(
                  catchError(err => {
                    if (err.status === 404) {
                      return of([]); // devuelve un arreglo vacío si no hay proyectos
                    }
                    return throwError(() => err);
                  }),
                  map(([proyectos, integrantesProyectos]) => {
                    const ids = integrantesProyectos
                      .filter(
                        (ip) =>
                          ip.integranteIdIntegrante == integrante.idIntegrante
                      )
                      .map((ip) => ip.proyectoIdProyecto);

                    return proyectos.filter((p) => ids.includes(p.idProyecto));
                  })
                )
              )
            );
        })
      )
      .subscribe((filteredProjects) => {
        this.proyectos = [...filteredProjects];
        this.cdr.detectChanges();
      });

    this.proyectosService.cargarProyectos();
    this.integrantesService.cargarIntegrantes();
  }

  agregarProyecto() {
    this.proyectosService
      .addProyecto({
        nombre: 'Nuevo Proyecto',
        fecha_creacion: new Date(),
      })
      .subscribe((nuevoProyecto) => {
        console.log(
          'IntegranteId: ' +
            this.integranteId +
            ' IdProyecto: ' +
            nuevoProyecto.idProyecto
        );
        this.integrantesProyectosService
          .addIntegranteProyecto({
            integranteIdIntegrante: this.integranteId,
            proyectoIdProyecto: nuevoProyecto.idProyecto,
          })
          .subscribe();
      });
    /*const nuevoNombre = `Proyecto ${this.proyectos.length + 1}`;
    this.proyectos.push(nuevoNombre);*/
  }

  onDeleteProyect(proyectId: number) {
    this.onDeleteProyectEventEmitter.emit(proyectId);
  }
}
