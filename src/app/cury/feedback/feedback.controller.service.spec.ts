import { TestBed } from '@angular/core/testing';

import { FeedbackController } from './feedback.controller.service';

describe('Feedback.ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeedbackController = TestBed.get(FeedbackController);
    expect(service).toBeTruthy();
  });
});
