import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { constants } from './constants';
import { Proyecto, ProyectoCreateDTO, ProyectoUpdateDTO } from '../models/proyecto';
import { IntegranteProyecto } from '../models/integrante-proyecto';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesProyectosService {
  httpClient = inject(HttpClient);
  private integrantesProyectosSubject = new BehaviorSubject<IntegranteProyecto[]>([]);
  integrantesProyectos$ = this.integrantesProyectosSubject.asObservable(); // <-- observable que puedes usar en tus componentes
  integrantesProyectos: IntegranteProyecto[];

  constructor() {
    this.integrantesProyectos = [];
  }

  cargarProyectos(idIntegrante: number): Observable<IntegranteProyecto[]> {
    return this.httpClient // No carga los proyectos asociados al username
      .get<any[]>(constants.apiUrl + '/api/integrantes/integrante/proyectos/' + idIntegrante)
      .pipe(
        map((integrantesProyectos) =>
          integrantesProyectos.map((ip) => ({
            integranteIdIntegrante: ip.integranteIdIntegrante,
            proyectoIdProyecto: ip.proyectoIdProyecto
          }))
        ),
        tap((integrantesProyectos) => {
          this.integrantesProyectosSubject.next(integrantesProyectos);
        })
      );
  }

  deleteProyecto(proyectoId: number): Observable<any> {
    console.log("ProyectoId: " + proyectoId);
    return this.httpClient
      .delete(`${constants.apiUrl}/api/proyecto/${proyectoId}`)
      .pipe(
        tap(() => {
          const actuales = this.integrantesProyectosSubject.getValue();
          const actualizados = actuales.filter((p) => p.proyectoIdProyecto !== proyectoId);
          this.integrantesProyectosSubject.next(actualizados);
        }),
        catchError((err) => {
          console.error('Error al eliminar el proyecto:', err);
          throw err;
        })
      );
  }

  addIntegranteProyecto(integranteProyecto: IntegranteProyecto): Observable<IntegranteProyecto> {
    return this.httpClient
      .post<any>(constants.apiUrl + '/api/integrantes/integrante/proyecto', integranteProyecto)
      .pipe(
        map((ip) => ({
            integranteIdIntegrante: ip.integranteIdIntegrante,
            proyectoIdProyecto: ip.proyectoIdProyecto
        })),
        tap((nuevoIntegranteProyecto) => {
          const actuales = this.integrantesProyectosSubject.getValue();
          this.integrantesProyectosSubject.next([...actuales, nuevoIntegranteProyecto]);
        })
      );
  }

  getIntegrantesProyectos(): IntegranteProyecto[] {
    return this.integrantesProyectos;
  }

}