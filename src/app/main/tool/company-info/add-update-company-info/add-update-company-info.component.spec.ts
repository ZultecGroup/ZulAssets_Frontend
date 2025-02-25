import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCompanyInfoComponent } from './add-update-company-info.component';

describe('AddUpdateCompanyInfoComponent', () => {
  let component: AddUpdateCompanyInfoComponent;
  let fixture: ComponentFixture<AddUpdateCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateCompanyInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
