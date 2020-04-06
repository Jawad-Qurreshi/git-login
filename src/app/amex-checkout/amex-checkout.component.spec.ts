import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmexCheckoutComponent } from './amex-checkout.component';

describe('AmexCheckoutComponent', () => {
  let component: AmexCheckoutComponent;
  let fixture: ComponentFixture<AmexCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmexCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmexCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
