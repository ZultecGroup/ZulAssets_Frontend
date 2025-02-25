import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlCodesComponent } from './gl-codes.component';

describe('GlCodesComponent', () => {
  let component: GlCodesComponent;
  let fixture: ComponentFixture<GlCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
