import { TestBed } from '@angular/core/testing';

import { QuestionController } from './question.controller.service';

describe('Question.ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionController = TestBed.get(QuestionController);
    expect(service).toBeTruthy();
  });
});
