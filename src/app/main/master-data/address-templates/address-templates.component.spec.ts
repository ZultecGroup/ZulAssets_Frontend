import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTemplatesComponent } from './address-templates.component';

describe('AddressTemplatesComponent', () => {
  let component: AddressTemplatesComponent;
  let fixture: ComponentFixture<AddressTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
