import { TestBed } from '@angular/core/testing';

import { PicyController } from './picy.controller.service';

describe('Picy.ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PicyController = TestBed.get(PicyController);
    expect(service).toBeTruthy();
  });
});
