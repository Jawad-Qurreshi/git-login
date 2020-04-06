import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteracTransferComponent } from './enterac-transfer.component';

describe('EnteracTransferComponent', () => {
  let component: EnteracTransferComponent;
  let fixture: ComponentFixture<EnteracTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnteracTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnteracTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
