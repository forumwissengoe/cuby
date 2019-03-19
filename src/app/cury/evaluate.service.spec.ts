import { TestBed } from '@angular/core/testing';

import { EvaluateService } from './evaluate.service';

describe('EvaluateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluateService = TestBed.get(EvaluateService);
    expect(service).toBeTruthy();
  });
});
