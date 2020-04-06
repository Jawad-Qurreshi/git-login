import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneKycComponent } from './one-kyc.component';

describe('OneKycComponent', () => {
  let component: OneKycComponent;
  let fixture: ComponentFixture<OneKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
