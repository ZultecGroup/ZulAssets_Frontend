import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDepreciationMethodsComponent } from './add-update-depreciation-methods.component';

describe('AddUpdateDepreciationMethodsComponent', () => {
  let component: AddUpdateDepreciationMethodsComponent;
  let fixture: ComponentFixture<AddUpdateDepreciationMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDepreciationMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDepreciationMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
