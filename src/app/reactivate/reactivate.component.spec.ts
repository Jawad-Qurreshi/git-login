import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateComponent } from './reactivate.component';

describe('ReactivateComponent', () => {
  let component: ReactivateComponent;
  let fixture: ComponentFixture<ReactivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
