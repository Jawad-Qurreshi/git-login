import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEditUserComponent } from './m-edit-user.component';

describe('MEditUserComponent', () => {
  let component: MEditUserComponent;
  let fixture: ComponentFixture<MEditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEditUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
