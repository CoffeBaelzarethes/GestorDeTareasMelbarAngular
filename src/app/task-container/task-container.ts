import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareasService } from '../tareas-service';
import { Tarea } from '../../models/tarea';
import { TareaEstadosService } from '../tarea-estados-service';
import { Estado } from '../../models/estado';
import { Grupo } from '../../models/grupo';
import { GruposService } from '../grupos-service';

@Component({
  selector: 'app-task-container',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './task-container.html',
  styleUrl: './task-container.css',
  providers: [GruposService, TareasService, TareaEstadosService, FormBuilder],
})
export class TaskContainer implements OnInit {
  httpClient = inject(HttpClient);
  @Input() grupo!: Grupo;
  isExpanded: boolean;
  isValidName: boolean;
  readyToRender: boolean;
  estado: number;
  tareas: Tarea[];
  estados: Estado[];
  nameControl: FormControl;

  formArray!: FormArray;

  @Output() delete: EventEmitter<Grupo> = new EventEmitter();

  constructor(
    private gruposService: GruposService,
    private tareasService: TareasService,
    private estadosService: TareaEstadosService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.tareas = [];
    this.estados = estadosService.getEstados();
    this.isExpanded = true;
    this.isValidName = false;
    this.readyToRender = false;
    this.estado = -1;

    this.nameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]);
  }

  ngOnInit(): void {
    this.tareasService.tareas$.subscribe(tareas => {
      setTimeout(() => {
        this.tareas = tareas.filter(t => t.grupo_idGrupo == this.grupo.id);

        this.formArray = this.fb.array(
          this.tareas.map(t => this.createGroup(t))
        );

        this.readyToRender = true;

        this.cdr.detectChanges();
      });
    });

    this.tareasService.cargarTareas(); // <-- carga desde la API al iniciar

    //this.fetchData();
    this.nameControl.setValue(this.grupo.nombre);
  }

  createGroup(tarea: Tarea): FormGroup {
    var group: FormGroup = this.fb.group({
      taskName: [tarea.nombre, [Validators.required, Validators.minLength(1)]],
      state: [tarea.estado, [Validators.required, Validators.minLength(1)]],
      deathTime: [
        tarea.vencimiento == null ? '' : tarea.vencimiento,
        [Validators.required, Validators.minLength(1)],
      ],
      note: [
        tarea.nota == null ? '' : tarea.nota,
        [Validators.required, Validators.minLength(1)],
      ],
    });

    group.controls['taskName'].valueChanges.subscribe((value) => {
      this.tareasService.updateTarea(tarea.idTarea, {
        nombre: value,
        estado: tarea.estado,
        vencimiento: tarea.vencimiento,
        nota: tarea.nota,
        grupo_idGrupo: tarea.grupo_idGrupo
      }).subscribe({
        next: t => console.log("Tarea actualizada", t),
        error: e => console.error("Error actualizando tarea", e)
      });
    });

    group.controls['state'].valueChanges.subscribe((value) => {
      this.tareasService.updateTarea(tarea.idTarea, {
        nombre: tarea.nombre,
        estado: value,
        vencimiento: tarea.vencimiento,
        nota: tarea.nota,
        grupo_idGrupo: tarea.grupo_idGrupo
      }).subscribe({
        next: t => console.log("Tarea actualizada", t),
        error: e => console.error("Error actualizando tarea", e)
      });
    });

    group.controls['deathTime'].valueChanges.subscribe((value) => {
      this.tareasService.updateTarea(tarea.idTarea, {
        nombre: tarea.nombre,
        estado: tarea.estado,
        vencimiento: value,
        nota: tarea.nota,
        grupo_idGrupo: tarea.grupo_idGrupo
      }).subscribe({
        next: t => console.log("Tarea actualizada", t),
        error: e => console.error("Error actualizando tarea", e)
      });
    });

    group.controls['note'].valueChanges.subscribe((value) => {
      this.tareasService.updateTarea(tarea.idTarea, {
        nombre: tarea.nombre,
        estado: tarea.estado,
        vencimiento: tarea.vencimiento,
        nota: value,
        grupo_idGrupo: tarea.grupo_idGrupo
      }).subscribe({
        next: t => console.log("Tarea actualizada", t),
        error: e => console.error("Error actualizando tarea", e)
      });
    });

    return group;
  }

  getFormGroup(i: number): FormGroup {
    return this.formArray.at(i) as FormGroup;
  }

  fetchData(): void {
    this.httpClient
      .get('https://localhost:7221/api/tareas')
      .subscribe((data) => {
        console.log(data);
      });
  }

  trackById(index: number, tarea: Tarea): number {
    return tarea.idTarea;
  }

  onLoseFocus(): void {
    if (this.nameControl.value.length == 0) {
      this.nameControl.setValue(this.grupo.nombre);
    } else {
      this.grupo.nombre = this.nameControl.value;
    }
  }

  onFocusLost(index: number): void {}

  onEnter(index: number): void {}

  tryToChangeName(event: Event): void {
    if (this.nameControl.value.length == 0) {
      this.nameControl.setValue(this.grupo.nombre);
    } else {
      this.grupo.nombre = this.nameControl.value;
      this.gruposService.updateGrupo(this.grupo.id, 
        { 
          nombre: this.nameControl.value,
          Proyecto_IdProyecto: this.grupo.Proyecto_IdProyecto  
        });
    }
  }

  onChange(): void {
    console.log('Field is updated!: ' + this.grupo.nombre);
  }

  tryToDelete(): void {
    this.delete.emit(this.grupo);
  }

  tryToCreateTask(): void {
    this.tareasService.addTarea({
      nombre: "Nueva Tarea",
      estado: 0,
      grupo_idGrupo: this.grupo.id
    }).subscribe((nuevaTarea) => {
      const group: FormGroup = this.createGroup(nuevaTarea);

      this.formArray.push(group);
    });
  }

  tryToDeleteTask(taskId: number, index: number): void {
    this.tareasService.deleteTarea(taskId).subscribe(() => {
      this.formArray.removeAt(index);
    });
  }
}
