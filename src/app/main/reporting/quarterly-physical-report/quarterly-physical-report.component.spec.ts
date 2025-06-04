import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterlyPhysicalReportComponent } from './quarterly-physical-report.component';

describe('QuarterlyPhysicalReportComponent', () => {
  let component: QuarterlyPhysicalReportComponent;
  let fixture: ComponentFixture<QuarterlyPhysicalReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterlyPhysicalReportComponent]
    });
    fixture = TestBed.createComponent(QuarterlyPhysicalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
