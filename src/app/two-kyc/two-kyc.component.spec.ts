import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoKycComponent } from './two-kyc.component';

describe('TwoKycComponent', () => {
  let component: TwoKycComponent;
  let fixture: ComponentFixture<TwoKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
