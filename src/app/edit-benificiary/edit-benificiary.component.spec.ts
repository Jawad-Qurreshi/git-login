import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBenificiaryComponent } from './edit-benificiary.component';

describe('EditBenificiaryComponent', () => {
  let component: EditBenificiaryComponent;
  let fixture: ComponentFixture<EditBenificiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBenificiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBenificiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
