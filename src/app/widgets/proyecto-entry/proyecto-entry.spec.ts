import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoEntry } from './proyecto-entry';

describe('ProyectoEntry', () => {
  let component: ProyectoEntry;
  let fixture: ComponentFixture<ProyectoEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
