import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MChangePasswordComponent } from './m-change-password.component';

describe('MChangePasswordComponent', () => {
  let component: MChangePasswordComponent;
  let fixture: ComponentFixture<MChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
