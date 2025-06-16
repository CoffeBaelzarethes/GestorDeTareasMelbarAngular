import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { constants } from './constants';
import { IntegranteCreateDTO, IntegranteUpdateDTO } from '../models/integrante';
import { Integrante } from '../models/integrante';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesService {
  httpClient = inject(HttpClient);
  private integrantesSubject = new BehaviorSubject<Integrante[]>([]);
  integrantes$ = this.integrantesSubject.asObservable(); // <-- observable que puedes usar en tus componentes
  integrantes: Integrante[];

  constructor() {
    this.integrantes = [];
  }

  cargarIntegrantes(): void {
    this.httpClient
      .get<any[]>(constants.apiUrl + '/api/integrantes')
      .pipe(
        map((integrantes) =>
          integrantes.map((i) => ({
            idIntegrante: i.idIntegrante,
            nombre: i.nombre
          }))
        ),
        tap((integrantes) => {
          this.integrantesSubject.next(integrantes);
        })
      )
      .subscribe();
  }

  cargarIntegrante(id: number): Observable<Integrante> {
    return this.httpClient
      .get<any>(constants.apiUrl + '/api/integrantes/integrante/' + id);
  }

  cargarIntegrantesPorProyecto(proyectoId: number): void {
  this.httpClient
    .get<any[]>(`${constants.apiUrl}/api/integrantes/por-proyecto/${proyectoId}`)
    .pipe(
      map(integrantes =>
        integrantes.map(i => ({
          idIntegrante: i.idIntegrante,
          nombre: i.nombre
        }))
      ),
      tap(integrantes => {
        this.integrantesSubject.next(integrantes);
      })
    )
    .subscribe();
  }

  verificarExistenciaPorNombre(nombre: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${constants.apiUrl}/api/integrantes/existe/${nombre}`);
  }

  vincularIntegranteProyecto(nombre : string, proyectId : number): Observable<any> {
    return this.httpClient.post(`${constants.apiUrl}/api/integrantes/integrante/proyecto/por_nombre`, {nombre: nombre, proyectoIdProyecto:proyectId});
  }

  eliminarRelacionIntegranteProyecto(idProyecto: number, nombreIntegrante: string): Observable<any> {
  const encodedNombre = encodeURIComponent(nombreIntegrante);
  const url = `${constants.apiUrl}/api/integrantes/relacion/${idProyecto}/${encodedNombre}`;
  return this.httpClient.delete(url);
}



  deleteIntegrante(integranteId: number): Observable<any> {
    console.log("ProyectoId: " + integranteId);
    return this.httpClient
      .delete(`${constants.apiUrl}/api/integrantes/integrante/${integranteId}`)
      .pipe(
        tap(() => {
          const actuales = this.integrantesSubject.getValue();
          const actualizados = actuales.filter((p) => p.idIntegrante !== integranteId);
          this.integrantesSubject.next(actualizados);
        }),
        catchError((err) => {
          console.error('Error al eliminar el integrante:', err);
          throw err;
        })
      );
  }

  deleteIntegranteByName(nombre: string): Observable<any> {
    console.log("ProyectoId: " + nombre);
    return this.httpClient
      .delete(`${constants.apiUrl}/api/integrantes/by_name/${nombre}`)
      .pipe(
        tap(() => {
          const actuales = this.integrantesSubject.getValue();
          const actualizados = actuales.filter((p) => p.nombre !== nombre);
          this.integrantesSubject.next(actualizados);
        }),
        catchError((err) => {
          console.error('Error al eliminar el integrante:', err);
          throw err;
        })
      );
  }

  addIntegrante(integrante: IntegranteCreateDTO): Observable<Integrante> {
    return this.httpClient
      .post<any>(constants.apiUrl + '/api/integrantes', integrante)
      .pipe(
        map((i) => ({
            idIntegrante: i.idIntegrante,
            nombre: i.nombre
        })),
        tap((nuevoIntegrante) => {
          const actuales = this.integrantesSubject.getValue();
          this.integrantesSubject.next([...actuales, nuevoIntegrante]);
        })
      );
  }

  updateIntegrante(integranteId: number, integrante: IntegranteUpdateDTO): Observable<Integrante> {
    return this.httpClient.put<any>(constants.apiUrl + '/api/integrantes/' + integranteId, integrante)
      .pipe(
        map((p) => ({
            idIntegrante: p.idIntegrante,
            nombre: p.nombre
        })),
        tap((actualizadoIntegrante) => {
          const actuales = this.integrantesSubject.getValue();
          const actualizados = actuales.map((integrante) =>
            integrante.idIntegrante === actualizadoIntegrante.idIntegrante 
              ? actualizadoIntegrante : integrante
          );
          this.integrantesSubject.next(actualizados);
        })
      );
  }

  getIntegrantes(): Integrante[] {
    return this.integrantes;
  }

}