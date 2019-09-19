import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPage } from './display.page';

describe('DisplayPage', () => {
  let component: DisplayPage;
  let fixture: ComponentFixture<DisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
