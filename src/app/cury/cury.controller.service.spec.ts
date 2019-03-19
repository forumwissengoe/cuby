import { TestBed } from '@angular/core/testing';

import { CuryControllerService } from './cury.controller.service';

describe('Cury.ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuryControllerService = TestBed.get(CuryControllerService);
    expect(service).toBeTruthy();
  });
});
