import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WirePaymentComponent } from './wire-payment.component';

describe('WirePaymentComponent', () => {
  let component: WirePaymentComponent;
  let fixture: ComponentFixture<WirePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WirePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WirePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
