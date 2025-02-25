import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodingPolicyComponent } from './bar-coding-policy.component';

describe('BarCodingPolicyComponent', () => {
  let component: BarCodingPolicyComponent;
  let fixture: ComponentFixture<BarCodingPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCodingPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodingPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
