import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAddPromocodeComponent } from './m-add-promocode.component';

describe('MAddPromocodeComponent', () => {
  let component: MAddPromocodeComponent;
  let fixture: ComponentFixture<MAddPromocodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MAddPromocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MAddPromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
