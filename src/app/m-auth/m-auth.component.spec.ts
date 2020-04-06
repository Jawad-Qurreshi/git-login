import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAuthComponent } from './m-auth.component';

describe('MAuthComponent', () => {
  let component: MAuthComponent;
  let fixture: ComponentFixture<MAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
