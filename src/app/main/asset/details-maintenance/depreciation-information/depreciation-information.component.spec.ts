import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationInformationComponent } from './depreciation-information.component';

describe('DepreciationInformationComponent', () => {
  let component: DepreciationInformationComponent;
  let fixture: ComponentFixture<DepreciationInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
