import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyFourComponent } from './send-money-four.component';

describe('SendMoneyFourComponent', () => {
  let component: SendMoneyFourComponent;
  let fixture: ComponentFixture<SendMoneyFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMoneyFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
