import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Grupo, GrupoCreateDTO } from '../models/grupo';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class GruposService implements OnInit {

  httpClient = inject(HttpClient);
  private gruposSubject = new BehaviorSubject<Grupo[]>([]);
  grupos$ = this.gruposSubject.asObservable(); // <-- observable que puedes usar en tus componentes
  grupos: Grupo[]

  constructor() {
    this.grupos = [
      { id: 0, nombre: "Estar", Proyecto_IdProyecto: 1 },
      { id: 1, nombre: "Mirar", Proyecto_IdProyecto: 1 },
      { id: 2, nombre: "Pensar", Proyecto_IdProyecto: 1 },
      { id: 3, nombre: "Tocar", Proyecto_IdProyecto: 2 },
    ];
  }

  ngOnInit(): void {
    
  }

  /*getGrupos(): Grupo[] {
    this.httpClient.get<Grupo[]>("http://localhost:5144/api/grupo").subscribe(data => {
      console.log(data);
      //this.grupos = data;
    });
    console.log(this.grupos);
    console.log("Xd");

    return this.grupos;
  }*/

  cargarGrupos(): void {
    this.httpClient.get<any[]>(constants.apiUrl + "/api/grupo")
      .pipe(
        map(grupos => grupos.map(g => ({
          id: g.idGrupo,
          nombre: g.nombre,
          Proyecto_IdProyecto: g.proyecto_IdProyecto
        }))),
        tap(grupos => this.gruposSubject.next(grupos)) // <-- actualiza el estado global
      ).subscribe();
  }

  deleteGrupo(group: Grupo): void {
      this.httpClient.delete(`${constants.apiUrl}/api/grupo/${group.id}`).subscribe({
      next: () => {
        const actuales = this.gruposSubject.getValue();
        const actualizados = actuales.filter(g => g.id !== group.id);
        this.gruposSubject.next(actualizados);
      },
      error: err => {
        console.error('Error al eliminar el grupo:', err);
      }
    });
  }

  addGrupo(group: GrupoCreateDTO): void {
    this.httpClient.post<any>(constants.apiUrl + "/api/grupo", group).pipe(
    map(g => ({
      id: g.idGrupo, // ← el backend lo devuelve con ID ya generado
      nombre: g.nombre,
      Proyecto_IdProyecto: g.proyecto_IdProyecto
    })),
    tap(nuevoGrupo => {
      const actuales = this.gruposSubject.getValue();
      this.gruposSubject.next([...actuales, nuevoGrupo]);
    })
    ).subscribe();
  }

  updateGrupo(groupId: number, group: GrupoCreateDTO) {
    this.httpClient.put<any>(constants.apiUrl + "/api/grupo/" + groupId, group).pipe(
      map(g => ({
        id: g.idGrupo,
        nombre: g.nombre,
        Proyecto_IdProyecto: g.proyecto_IdProyecto
      })),
      tap(actualizadoGrupo => {
        const actuales = this.gruposSubject.getValue();
        const actualizados = actuales.map(grupo =>
          grupo.id === actualizadoGrupo.id ? actualizadoGrupo : grupo
        );
        this.gruposSubject.next(actualizados);
      })
    ).subscribe();
  }

}
