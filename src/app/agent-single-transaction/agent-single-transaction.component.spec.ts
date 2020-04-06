import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSingleTransactionComponent } from './agent-single-transaction.component';

describe('AgentSingleTransactionComponent', () => {
  let component: AgentSingleTransactionComponent;
  let fixture: ComponentFixture<AgentSingleTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentSingleTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSingleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
