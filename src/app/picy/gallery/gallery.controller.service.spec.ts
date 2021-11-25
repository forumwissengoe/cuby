import { TestBed } from '@angular/core/testing';

import { Gallery.ControllerService } from './gallery.controller.service';

describe('Gallery.ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Gallery.ControllerService = TestBed.get(Gallery.ControllerService);
    expect(service).toBeTruthy();
  });
});
