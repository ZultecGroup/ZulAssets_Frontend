import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationPolicyComponent } from './depreciation-policy.component';

describe('DepreciationPolicyComponent', () => {
  let component: DepreciationPolicyComponent;
  let fixture: ComponentFixture<DepreciationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
