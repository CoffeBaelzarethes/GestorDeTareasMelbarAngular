import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Proyecto } from '../../../models/proyecto';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectosService } from '../../proyectos-service';

@Component({
  selector: 'app-proyecto-entry',
  imports: [ReactiveFormsModule],
  templateUrl: './proyecto-entry.html',
  styleUrl: './proyecto-entry.css'
})
export class ProyectoEntry implements OnInit {

  @Input() proyecto!: Proyecto;
  @Input() selectedProyectoEventEmitter!: EventEmitter<Proyecto>;
  @Output() onDeleteProyectEventEmitter: EventEmitter<number> = new EventEmitter<number>();

  readonly: boolean;
  proyectNameControl: FormControl;

  constructor(
    private proyectosService: ProyectosService,
    private cdr: ChangeDetectorRef
  ) {
    this.readonly = true;
    this.proyectNameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]);
  }

  ngOnInit(): void {
      this.proyectNameControl.setValue(this.proyecto.nombre);
  }

  onDoubleClick() {
    this.readonly = !this.readonly;
    console.log(this.readonly);
    this.cdr.detectChanges();
  }

  seleccionarProyecto(proyecto: Proyecto) {
    this.selectedProyectoEventEmitter.emit(proyecto);
  }

  onLoseFocus(proyecto: Proyecto): void {
    if (this.proyectNameControl.value.length == 0) {
      this.proyectNameControl.setValue(proyecto.nombre);
    } else {
      this.proyectosService.updateProyecto(proyecto.idProyecto, 
      { 
        nombre: this.proyectNameControl.value
      }).subscribe(() => {
        this.readonly = true;
      });
    }
  }

  tryToChangeProyectoName(event: Event, proyecto: Proyecto): void {
    if (this.proyectNameControl.value.length == 0) {
      this.proyectNameControl.setValue(proyecto.nombre);
    } else {
      this.proyectosService.updateProyecto(proyecto.idProyecto, 
      { 
        nombre: this.proyectNameControl.value
      }).subscribe(() => {
        this.readonly = true;
      });
    }
  }

  eliminarProyecto(proyectoId: number) {
    this.onDeleteProyectEventEmitter.emit(proyectoId);

    this.proyectosService.deleteProyecto(proyectoId).subscribe();
  }

}
