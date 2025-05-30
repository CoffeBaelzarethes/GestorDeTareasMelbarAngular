import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Grupo } from '../models/grupo';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

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
    this.httpClient.get<any[]>('http://localhost:5144/api/grupo')
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
    this.httpClient.delete(`http://localhost:5144/api/grupo/${group.id}`)
      .pipe(
        tap(() => {
          const gruposActuales = this.gruposSubject.getValue();
          const actualizados = gruposActuales.filter(g => g.id !== group.id);
          this.gruposSubject.next(actualizados);
        })
      ).subscribe();
  }

  addGrupo(group: Grupo): void {
    this.httpClient.post<any>('http://localhost:5144/api/grupo', group)
      .pipe(
        map(g => ({
          id: g.idGrupo,
          nombre: g.nombre,
          Proyecto_IdProyecto: g.proyecto_IdProyecto
        })),
        tap(nuevoGrupo => {
          const gruposActuales = this.gruposSubject.getValue();
          this.gruposSubject.next([...gruposActuales, nuevoGrupo]);
        })
      ).subscribe();
  }

  updateGrupo(groupId: number, group: Grupo) {
    
  }

}
