import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareasService } from '../tareas-service';
import { Tarea } from '../../models/tarea';
import { TareaEstadosService } from '../tarea-estados-service';
import { Estado } from '../../models/estado';
import { Grupo } from '../../models/grupo';

@Component({
  selector: 'app-task-container',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './task-container.html',
  styleUrl: './task-container.css',
  providers: [TareasService, TareaEstadosService, FormBuilder],
})
export class TaskContainer implements OnInit {
  httpClient = inject(HttpClient);
  @Input() grupo!: Grupo;
  isExpanded: boolean;
  isValidName: boolean;
  estado: number;
  tareas: Tarea[];
  estados: Estado[];
  nameControl: FormControl;

  formArray!: FormArray;

  @Output() delete: EventEmitter<Grupo> = new EventEmitter();

  constructor(
    private tareasService: TareasService,
    private estadosService: TareaEstadosService,
    private fb: FormBuilder
  ) {
    this.tareas = tareasService.getTareas();
    this.estados = estadosService.getEstados();
    this.isExpanded = false;
    this.isValidName = false;
    this.estado = -1;

    this.nameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]);
  }

  ngOnInit(): void {
    this.formArray = this.fb.array(
      this.tareasService.tareas.map((t, i) => this.createGroup(t, i))
    );

    //this.fetchData();
    this.nameControl.setValue(this.grupo.nombre);
  }

  createGroup(tarea: Tarea, index: number): FormGroup {
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
      this.tareas[index].nombre = value;
    });

    group.controls['state'].valueChanges.subscribe((value) => {
      this.tareas[index].estado = value;
    });

    group.controls['deathTime'].valueChanges.subscribe((value) => {
      this.tareas[index].vencimiento = value;
    });

    group.controls['note'].valueChanges.subscribe((value) => {
      this.tareas[index].nota = value;
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
    return tarea.id;
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
    }
  }

  onChange(): void {
    console.log('Field is updated!: ' + this.grupo.nombre);
  }

  tryToDelete(): void {
    this.delete.emit(this.grupo);
  }

  tryToCreateTask(): void {
    var tarea: Tarea = {
      id: Math.floor(Math.random() * 1000),
      nombre: 'NuevaTarea',
      estado: 0,
    };
    this.tareas = this.tareasService.addTarea(tarea);

    const group: FormGroup = this.createGroup(tarea, this.tareas.length - 1);

    this.formArray.push(group);
  }

  tryToDeleteTask(taskId: number, index: number): void {
    this.tareas = this.tareasService.deleteTarea(taskId);
    this.formArray.removeAt(index);
  }
}
