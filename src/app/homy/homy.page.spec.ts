import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomyPage } from './homy.page';

describe('HomyPage', () => {
  let component: HomyPage;
  let fixture: ComponentFixture<HomyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
