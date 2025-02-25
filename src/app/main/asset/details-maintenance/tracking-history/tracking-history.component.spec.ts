import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingHistoryComponent } from './tracking-history.component';

describe('TrackingHistoryComponent', () => {
  let component: TrackingHistoryComponent;
  let fixture: ComponentFixture<TrackingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
