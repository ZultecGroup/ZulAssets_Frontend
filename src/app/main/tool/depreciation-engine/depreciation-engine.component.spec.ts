import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationEngineComponent } from './depreciation-engine.component';

describe('DepreciationEngineComponent', () => {
  let component: DepreciationEngineComponent;
  let fixture: ComponentFixture<DepreciationEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
