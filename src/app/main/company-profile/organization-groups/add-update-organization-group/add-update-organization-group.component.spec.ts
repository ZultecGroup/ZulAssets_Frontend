import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateOrganizationGroupComponent } from './add-update-organization-group.component';

describe('AddUpdateOrganizationGroupComponent', () => {
  let component: AddUpdateOrganizationGroupComponent;
  let fixture: ComponentFixture<AddUpdateOrganizationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateOrganizationGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateOrganizationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
