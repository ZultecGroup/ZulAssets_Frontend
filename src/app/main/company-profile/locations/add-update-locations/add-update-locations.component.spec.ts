import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateLocationsComponent } from './add-update-locations.component';

describe('AddUpdateLocationsComponent', () => {
  let component: AddUpdateLocationsComponent;
  let fixture: ComponentFixture<AddUpdateLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
