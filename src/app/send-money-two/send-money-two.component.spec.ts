import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyTwoComponent } from './send-money-two.component';

describe('SendMoneyTwoComponent', () => {
  let component: SendMoneyTwoComponent;
  let fixture: ComponentFixture<SendMoneyTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMoneyTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
