import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MLoginHistoryComponent } from './m-login-history.component';

describe('MLoginHistoryComponent', () => {
  let component: MLoginHistoryComponent;
  let fixture: ComponentFixture<MLoginHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MLoginHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MLoginHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
