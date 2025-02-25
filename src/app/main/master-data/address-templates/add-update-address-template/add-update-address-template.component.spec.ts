import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAddressTemplateComponent } from './add-update-address-template.component';

describe('AddUpdateAddressTemplateComponent', () => {
  let component: AddUpdateAddressTemplateComponent;
  let fixture: ComponentFixture<AddUpdateAddressTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAddressTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAddressTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
