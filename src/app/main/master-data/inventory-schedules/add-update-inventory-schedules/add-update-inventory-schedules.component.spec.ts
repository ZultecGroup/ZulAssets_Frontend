import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInventorySchedulesComponent } from './add-update-inventory-schedules.component';

describe('AddUpdateInventorySchedulesComponent', () => {
  let component: AddUpdateInventorySchedulesComponent;
  let fixture: ComponentFixture<AddUpdateInventorySchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInventorySchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInventorySchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
