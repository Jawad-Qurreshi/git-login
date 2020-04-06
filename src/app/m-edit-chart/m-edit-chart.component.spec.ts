import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEditChartComponent } from './m-edit-chart.component';

describe('MEditChartComponent', () => {
  let component: MEditChartComponent;
  let fixture: ComponentFixture<MEditChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEditChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEditChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
