import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPageModal } from './feedback-page-modal.component';

describe('FeedbackPageModal', () => {
  let component: FeedbackPageModal;
  let fixture: ComponentFixture<FeedbackPageModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackPageModal ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPageModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
