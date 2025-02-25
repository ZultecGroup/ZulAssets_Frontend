import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSuppliersComponent } from './add-update-suppliers.component';

describe('AddUpdateSuppliersComponent', () => {
  let component: AddUpdateSuppliersComponent;
  let fixture: ComponentFixture<AddUpdateSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
