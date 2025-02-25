import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGlCodesComponent } from './add-update-gl-codes.component';

describe('AddUpdateGlCodesComponent', () => {
  let component: AddUpdateGlCodesComponent;
  let fixture: ComponentFixture<AddUpdateGlCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateGlCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateGlCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
