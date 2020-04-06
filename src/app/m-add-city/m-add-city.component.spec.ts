import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAddCityComponent } from './m-add-city.component';

describe('MAddCityComponent', () => {
  let component: MAddCityComponent;
  let fixture: ComponentFixture<MAddCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MAddCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MAddCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
