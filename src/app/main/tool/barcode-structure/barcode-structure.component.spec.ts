import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeStructureComponent } from './barcode-structure.component';

describe('BarcodeStructureComponent', () => {
  let component: BarcodeStructureComponent;
  let fixture: ComponentFixture<BarcodeStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
