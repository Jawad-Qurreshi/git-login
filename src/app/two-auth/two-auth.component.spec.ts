import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoAuthComponent } from './two-auth.component';

describe('TwoAuthComponent', () => {
  let component: TwoAuthComponent;
  let fixture: ComponentFixture<TwoAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
