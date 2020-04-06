import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MSingleTransactionComponent } from './m-single-transaction.component';

describe('MSingleTransactionComponent', () => {
  let component: MSingleTransactionComponent;
  let fixture: ComponentFixture<MSingleTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSingleTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSingleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
