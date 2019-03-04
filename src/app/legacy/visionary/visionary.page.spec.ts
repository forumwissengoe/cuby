import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionaryPage } from './visionary.page';

describe('VisionaryPage', () => {
  let component: VisionaryPage;
  let fixture: ComponentFixture<VisionaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
