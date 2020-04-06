import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEditBcountryComponent } from './m-edit-bcountry.component';

describe('MEditBcountryComponent', () => {
  let component: MEditBcountryComponent;
  let fixture: ComponentFixture<MEditBcountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEditBcountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEditBcountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
