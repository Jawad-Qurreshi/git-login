import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEosaddressComponent } from './m-eosaddress.component';

describe('MEosaddressComponent', () => {
  let component: MEosaddressComponent;
  let fixture: ComponentFixture<MEosaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEosaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEosaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
