import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { Tarea, TareaCreateDTO } from '../models/tarea';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  httpClient = inject(HttpClient);
  private tareasSubject = new BehaviorSubject<Tarea[]>([]);
  tareas$ = this.tareasSubject.asObservable(); 
  tareas: Tarea[];

  constructor() {
    this.tareas = [];
  }

  cargarTareas(): void {
    this.httpClient
      .get<any[]>(constants.apiUrl + '/api/tareas')
      .pipe(
        map((tareas) =>
          tareas.map((t) => ({
            idTarea: t.idTarea,
            nombre: t.nombre,
            estado: t.estado,
            vencimiento: t.vencimiento,
            nota: t.nota,
            grupo_idGrupo: t.grupo_idGrupo,
          }))
        ),
        tap((tareas) => {
          this.tareasSubject.next(tareas);
        })
      )
      .subscribe();
  }

  deleteTarea(tareaId: number): Observable<any> {
    console.log("TareaId: " + tareaId);
    return this.httpClient
      .delete(`${constants.apiUrl}/api/tareas/${tareaId}`)
      .pipe(
        tap(() => {
          const actuales = this.tareasSubject.getValue();
          const actualizados = actuales.filter((t) => t.idTarea !== tareaId);
          this.tareasSubject.next(actualizados);
        }),
        catchError((err) => {
          console.error('Error al eliminar la tarea:', err);
          throw err;
        })
      );
  }

  addTarea(tarea: TareaCreateDTO): Observable<Tarea> {
    return this.httpClient
      .post<any>(constants.apiUrl + '/api/tareas', tarea)
      .pipe(
        map((t) => ({
          idTarea: t.idTarea, // ← el backend lo devuelve con ID ya generado
          nombre: t.nombre,
          estado: t.estado,
          vencimient: t.vencimiento,
          nota: t.nota,
          grupo_idGrupo: t.grupo_idGrupo,
        })),
        tap((nuevoTarea) => {
          const actuales = this.tareasSubject.getValue();
          this.tareasSubject.next([...actuales, nuevoTarea]);
        })
      );
  }

  updateTarea(tareaId: number, tarea: TareaCreateDTO): Observable<Tarea> {
    return this.httpClient.put<any>(constants.apiUrl + '/api/tareas/' + tareaId, tarea)
      .pipe(
        map((t) => ({
          idTarea: t.idTarea,
          nombre: t.nombre,
          estado: t.estado,
          vencimiento: t.vencimiento,
          nota: t.nota,
          grupo_idGrupo: t.grupo_idGrupo,
        })),
        tap((actualizadoTarea) => {
          const actuales = this.tareasSubject.getValue();
          const actualizados = actuales.map((tarea) =>
            tarea.idTarea === actualizadoTarea.idTarea ? actualizadoTarea : tarea
          );
          this.tareasSubject.next(actualizados);
        })
      );
  }

  getTareas(): Tarea[] {
    return this.tareas;
  }

}
