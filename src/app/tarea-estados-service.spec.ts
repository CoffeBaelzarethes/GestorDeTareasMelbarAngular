import { TestBed } from '@angular/core/testing';

import { TareaEstadosService } from './tarea-estados-service';

describe('TareaEstadosService', () => {
  let service: TareaEstadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaEstadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
