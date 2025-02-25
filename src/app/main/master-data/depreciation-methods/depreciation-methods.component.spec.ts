import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationMethodsComponent } from './depreciation-methods.component';

describe('DepreciationMethodsComponent', () => {
  let component: DepreciationMethodsComponent;
  let fixture: ComponentFixture<DepreciationMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
