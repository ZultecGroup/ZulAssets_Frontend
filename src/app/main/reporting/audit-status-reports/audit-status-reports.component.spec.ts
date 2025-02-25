import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditStatusReportsComponent } from './audit-status-reports.component';

describe('AuditStatusReportsComponent', () => {
  let component: AuditStatusReportsComponent;
  let fixture: ComponentFixture<AuditStatusReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditStatusReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditStatusReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
