import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDesignationComponent } from './add-update-designation.component';

describe('AddUpdateDesignationComponent', () => {
  let component: AddUpdateDesignationComponent;
  let fixture: ComponentFixture<AddUpdateDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
