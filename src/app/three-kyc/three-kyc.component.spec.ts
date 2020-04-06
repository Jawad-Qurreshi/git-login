import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeKycComponent } from './three-kyc.component';

describe('ThreeKycComponent', () => {
  let component: ThreeKycComponent;
  let fixture: ComponentFixture<ThreeKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
