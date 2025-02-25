import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCompaniesComponent } from './add-update-companies.component';

describe('AddUpdateCompaniesComponent', () => {
  let component: AddUpdateCompaniesComponent;
  let fixture: ComponentFixture<AddUpdateCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
