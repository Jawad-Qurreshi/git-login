import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBenificiaryComponent } from './add-benificiary.component';

describe('AddBenificiaryComponent', () => {
  let component: AddBenificiaryComponent;
  let fixture: ComponentFixture<AddBenificiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBenificiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBenificiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
