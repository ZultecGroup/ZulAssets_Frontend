import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTransferComponent } from './data-transfer.component';

describe('DataTransferComponent', () => {
  let component: DataTransferComponent;
  let fixture: ComponentFixture<DataTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
