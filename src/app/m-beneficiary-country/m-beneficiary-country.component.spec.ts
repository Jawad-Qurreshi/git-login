import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MBeneficiaryCountryComponent } from './m-beneficiary-country.component';

describe('MBeneficiaryCountryComponent', () => {
  let component: MBeneficiaryCountryComponent;
  let fixture: ComponentFixture<MBeneficiaryCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MBeneficiaryCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MBeneficiaryCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
