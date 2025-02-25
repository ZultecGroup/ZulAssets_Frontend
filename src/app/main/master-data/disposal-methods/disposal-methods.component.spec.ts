import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalMethodsComponent } from './disposal-methods.component';

describe('DisposalMethodsComponent', () => {
  let component: DisposalMethodsComponent;
  let fixture: ComponentFixture<DisposalMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisposalMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
