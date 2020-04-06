import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAddStateComponent } from './m-add-state.component';

describe('MAddStateComponent', () => {
  let component: MAddStateComponent;
  let fixture: ComponentFixture<MAddStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MAddStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MAddStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
