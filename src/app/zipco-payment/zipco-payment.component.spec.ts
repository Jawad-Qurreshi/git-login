import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipcoPaymentComponent } from './zipco-payment.component';

describe('ZipcoPaymentComponent', () => {
  let component: ZipcoPaymentComponent;
  let fixture: ComponentFixture<ZipcoPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZipcoPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipcoPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
