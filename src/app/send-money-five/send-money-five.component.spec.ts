import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyFiveComponent } from './send-money-five.component';

describe('SendMoneyFiveComponent', () => {
  let component: SendMoneyFiveComponent;
  let fixture: ComponentFixture<SendMoneyFiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMoneyFiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
