import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoversPage } from './covers.page';

describe('CoversPage', () => {
  let component: CoversPage;
  let fixture: ComponentFixture<CoversPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoversPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
