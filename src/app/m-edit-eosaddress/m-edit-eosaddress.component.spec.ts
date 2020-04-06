import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEditEosaddressComponent } from './m-edit-eosaddress.component';

describe('MEditEosaddressComponent', () => {
  let component: MEditEosaddressComponent;
  let fixture: ComponentFixture<MEditEosaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEditEosaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEditEosaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
