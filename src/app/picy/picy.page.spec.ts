import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicyPage } from './picy.page';

describe('PicyPage', () => {
  let component: PicyPage;
  let fixture: ComponentFixture<PicyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
