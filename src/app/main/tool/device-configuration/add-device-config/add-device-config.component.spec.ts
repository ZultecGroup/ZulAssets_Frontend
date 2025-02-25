import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceConfigComponent } from './add-device-config.component';

describe('AddDeviceConfigComponent', () => {
  let component: AddDeviceConfigComponent;
  let fixture: ComponentFixture<AddDeviceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeviceConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeviceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
