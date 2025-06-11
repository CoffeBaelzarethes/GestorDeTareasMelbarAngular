import { TestBed } from '@angular/core/testing';

import { IntegrantesProyectosService } from './integrantes-proyectos-service';

describe('IntegrantesProyectosService', () => {
  let service: IntegrantesProyectosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrantesProyectosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
