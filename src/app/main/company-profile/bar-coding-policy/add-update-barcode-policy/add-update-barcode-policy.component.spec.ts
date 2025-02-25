import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBarcodePolicyComponent } from './add-update-barcode-policy.component';

describe('AddUpdateBarcodePolicyComponent', () => {
  let component: AddUpdateBarcodePolicyComponent;
  let fixture: ComponentFixture<AddUpdateBarcodePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBarcodePolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBarcodePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
