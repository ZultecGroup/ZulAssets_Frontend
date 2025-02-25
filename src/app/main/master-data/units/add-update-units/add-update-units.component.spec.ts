import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateUnitsComponent } from './add-update-units.component';

describe('AddUpdateUnitsComponent', () => {
  let component: AddUpdateUnitsComponent;
  let fixture: ComponentFixture<AddUpdateUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
