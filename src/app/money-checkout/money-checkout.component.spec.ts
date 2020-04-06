import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyCheckoutComponent } from './money-checkout.component';

describe('MoneyCheckoutComponent', () => {
  let component: MoneyCheckoutComponent;
  let fixture: ComponentFixture<MoneyCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
