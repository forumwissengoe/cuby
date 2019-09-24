import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NfcPage } from './nfc.page';

describe('NfcPage', () => {
  let component: NfcPage;
  let fixture: ComponentFixture<NfcPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NfcPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NfcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
