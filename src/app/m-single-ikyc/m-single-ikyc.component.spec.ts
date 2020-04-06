import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MSingleIkycComponent } from './m-single-ikyc.component';

describe('MSingleIkycComponent', () => {
  let component: MSingleIkycComponent;
  let fixture: ComponentFixture<MSingleIkycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSingleIkycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSingleIkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
