import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MPromocodeComponent } from './m-promocode.component';

describe('MPromocodeComponent', () => {
  let component: MPromocodeComponent;
  let fixture: ComponentFixture<MPromocodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MPromocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MPromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
