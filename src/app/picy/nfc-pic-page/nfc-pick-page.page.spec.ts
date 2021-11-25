import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NfcPickPagePage } from './nfc-pick-page.page';

describe('NfcPickPagePage', () => {
  let component: NfcPickPagePage;
  let fixture: ComponentFixture<NfcPickPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NfcPickPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NfcPickPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
