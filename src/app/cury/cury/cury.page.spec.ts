import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuryPage } from './cury.page';

describe('CuryPage', () => {
  let component: CuryPage;
  let fixture: ComponentFixture<CuryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
