import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStatementReportsComponent } from './asset-statement-reports.component';

describe('AssetStatementReportsComponent', () => {
  let component: AssetStatementReportsComponent;
  let fixture: ComponentFixture<AssetStatementReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetStatementReportsComponent]
    });
    fixture = TestBed.createComponent(AssetStatementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
