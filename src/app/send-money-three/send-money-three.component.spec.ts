import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyThreeComponent } from './send-money-three.component';

describe('SendMoneyThreeComponent', () => {
  let component: SendMoneyThreeComponent;
  let fixture: ComponentFixture<SendMoneyThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMoneyThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
