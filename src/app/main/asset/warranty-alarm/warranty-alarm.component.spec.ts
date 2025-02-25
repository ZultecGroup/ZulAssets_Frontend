import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyAlarmComponent } from './warranty-alarm.component';

describe('GenerateTempAssetsComponent', () => {
  let component: WarrantyAlarmComponent;
  let fixture: ComponentFixture<WarrantyAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarrantyAlarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
