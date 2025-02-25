import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAcquisitionComponent } from './data-acquisition.component';

describe('DataAcquisitionComponent', () => {
  let component: DataAcquisitionComponent;
  let fixture: ComponentFixture<DataAcquisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataAcquisitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
