import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelIntegrantes } from './panel-integrantes';

describe('PanelIntegrantes', () => {
  let component: PanelIntegrantes;
  let fixture: ComponentFixture<PanelIntegrantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelIntegrantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelIntegrantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
