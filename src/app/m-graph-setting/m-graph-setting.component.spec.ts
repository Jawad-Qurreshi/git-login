import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MGraphSettingComponent } from './m-graph-setting.component';

describe('MGraphSettingComponent', () => {
  let component: MGraphSettingComponent;
  let fixture: ComponentFixture<MGraphSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MGraphSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MGraphSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
