import { TestBed } from '@angular/core/testing';

import { DetailsController } from './details.controller.service';

describe('Details.ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailsController = TestBed.get(DetailsController);
    expect(service).toBeTruthy();
  });
});
