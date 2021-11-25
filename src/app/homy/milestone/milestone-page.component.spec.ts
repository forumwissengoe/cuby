import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonePage } from './milestone-page.component';

describe('MilestonePage', () => {
  let component: MilestonePage;
  let fixture: ComponentFixture<MilestonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilestonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
