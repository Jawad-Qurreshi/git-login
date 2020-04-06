import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MTwoAuthComponent } from './m-two-auth.component';

describe('MTwoAuthComponent', () => {
  let component: MTwoAuthComponent;
  let fixture: ComponentFixture<MTwoAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MTwoAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MTwoAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
