import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRolesComponent } from './add-update-roles.component';

describe('AddUpdateRolesComponent', () => {
  let component: AddUpdateRolesComponent;
  let fixture: ComponentFixture<AddUpdateRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
