import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCostHistoryComponent } from './additional-cost-history.component';

describe('AdditionalCostHistoryComponent', () => {
  let component: AdditionalCostHistoryComponent;
  let fixture: ComponentFixture<AdditionalCostHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalCostHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
