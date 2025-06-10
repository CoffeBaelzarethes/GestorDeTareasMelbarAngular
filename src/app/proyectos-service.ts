import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { constants } from './constants';
import { Proyecto, ProyectoCreateDTO, ProyectoUpdateDTO } from '../models/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  httpClient = inject(HttpClient);
  private proyectosSubject = new BehaviorSubject<Proyecto[]>([]);
  proyectos$ = this.proyectosSubject.asObservable(); // <-- observable que puedes usar en tus componentes
  proyectos: Proyecto[];

  constructor() {
    this.proyectos = [];
  }

  cargarProyectos(): void {
    this.httpClient
      .get<any[]>(constants.apiUrl + '/api/proyecto')
      .pipe(
        map((proyectos) =>
          proyectos.map((p) => ({
            idProyecto: p.idProyecto,
            nombre: p.nombre,
            fecha_creacion: p.fecha_creacion,
          }))
        ),
        tap((proyectos) => {
          this.proyectosSubject.next(proyectos);
        })
      )
      .subscribe();
  }

  deleteProyecto(proyectoId: number): Observable<any> {
    console.log("ProyectoId: " + proyectoId);
    return this.httpClient
      .delete(`${constants.apiUrl}/api/proyecto/${proyectoId}`)
      .pipe(
        tap(() => {
          const actuales = this.proyectosSubject.getValue();
          const actualizados = actuales.filter((p) => p.idProyecto !== proyectoId);
          this.proyectosSubject.next(actualizados);
        }),
        catchError((err) => {
          console.error('Error al eliminar el proyecto:', err);
          throw err;
        })
      );
  }

  addProyecto(proyecto: ProyectoCreateDTO): Observable<Proyecto> {
    return this.httpClient
      .post<any>(constants.apiUrl + '/api/proyecto', proyecto)
      .pipe(
        map((p) => ({
            idProyecto: p.idProyecto,
            nombre: p.nombre,
            fecha_creacion: p.fecha_creacion,
        })),
        tap((nuevoProyecto) => {
          const actuales = this.proyectosSubject.getValue();
          this.proyectosSubject.next([...actuales, nuevoProyecto]);
        })
      );
  }

  updateProyecto(proyectoId: number, proyecto: ProyectoUpdateDTO): Observable<Proyecto> {
    return this.httpClient.put<any>(constants.apiUrl + '/api/proyecto/' + proyectoId, proyecto)
      .pipe(
        map((p) => ({
            idProyecto: p.idProyecto,
            nombre: p.nombre,
            fecha_creacion: p.fecha_creacion,
        })),
        tap((actualizadoProyecto) => {
          const actuales = this.proyectosSubject.getValue();
          const actualizados = actuales.map((proyecto) =>
            proyecto.idProyecto === actualizadoProyecto.idProyecto ? actualizadoProyecto : proyecto
          );
          this.proyectosSubject.next(actualizados);
        })
      );
  }

  getProyectos(): Proyecto[] {
    return this.proyectos;
  }

}
