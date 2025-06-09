import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProyectos } from './panel-proyectos';

describe('PanelProyectos', () => {
  let component: PanelProyectos;
  let fixture: ComponentFixture<PanelProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
