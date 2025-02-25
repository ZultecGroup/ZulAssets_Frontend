import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBrandsComponent } from './add-update-brands.component';

describe('AddUpdateBrandsComponent', () => {
  let component: AddUpdateBrandsComponent;
  let fixture: ComponentFixture<AddUpdateBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBrandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
