import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MybeneficiaryComponent } from './mybeneficiary.component';

describe('MybeneficiaryComponent', () => {
  let component: MybeneficiaryComponent;
  let fixture: ComponentFixture<MybeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MybeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
