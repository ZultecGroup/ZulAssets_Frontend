import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCustodyTransferComponent } from './location-custody-transfer.component';

describe('LocationCustodyTransferComponent', () => {
  let component: LocationCustodyTransferComponent;
  let fixture: ComponentFixture<LocationCustodyTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationCustodyTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCustodyTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
