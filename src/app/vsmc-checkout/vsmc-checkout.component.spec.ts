import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsmcCheckoutComponent } from './vsmc-checkout.component';

describe('VsmcCheckoutComponent', () => {
  let component: VsmcCheckoutComponent;
  let fixture: ComponentFixture<VsmcCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsmcCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsmcCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
