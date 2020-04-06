import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MIkycComponent } from './m-ikyc.component';

describe('MIkycComponent', () => {
  let component: MIkycComponent;
  let fixture: ComponentFixture<MIkycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MIkycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MIkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
