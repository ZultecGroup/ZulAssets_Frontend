import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMaintenanceComponent } from './details-maintenance.component';

describe('DetailsMaintenanceComponent', () => {
  let component: DetailsMaintenanceComponent;
  let fixture: ComponentFixture<DetailsMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
