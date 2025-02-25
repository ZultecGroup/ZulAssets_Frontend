import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendInventoryComponent } from './backend-inventory.component';

describe('BackendInventoryComponent', () => {
  let component: BackendInventoryComponent;
  let fixture: ComponentFixture<BackendInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackendInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
