import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedReportsComponent } from './extended-reports.component';

describe('ExtendedReportsComponent', () => {
  let component: ExtendedReportsComponent;
  let fixture: ComponentFixture<ExtendedReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedReportsComponent]
    });
    fixture = TestBed.createComponent(ExtendedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
