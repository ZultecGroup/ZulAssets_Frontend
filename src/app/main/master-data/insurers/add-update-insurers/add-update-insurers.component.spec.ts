import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInsurersComponent } from './add-update-insurers.component';

describe('AddUpdateInsurersComponent', () => {
  let component: AddUpdateInsurersComponent;
  let fixture: ComponentFixture<AddUpdateInsurersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInsurersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInsurersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
