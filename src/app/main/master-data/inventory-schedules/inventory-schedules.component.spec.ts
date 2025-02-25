import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySchedulesComponent } from './inventory-schedules.component';

describe('InventorySchedulesComponent', () => {
  let component: InventorySchedulesComponent;
  let fixture: ComponentFixture<InventorySchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorySchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
