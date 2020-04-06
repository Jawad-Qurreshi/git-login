import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MTransactionComponent } from './m-transaction.component';

describe('MTransactionComponent', () => {
  let component: MTransactionComponent;
  let fixture: ComponentFixture<MTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
