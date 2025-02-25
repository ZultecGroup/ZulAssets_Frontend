import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineMachinesComponent } from './offline-machines.component';

describe('OfflineMachinesComponent', () => {
  let component: OfflineMachinesComponent;
  let fixture: ComponentFixture<OfflineMachinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineMachinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineMachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
