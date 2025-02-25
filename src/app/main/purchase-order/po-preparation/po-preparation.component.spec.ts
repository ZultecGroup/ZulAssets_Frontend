import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoPreparationComponent } from './po-preparation.component';

describe('PoPreparationComponent', () => {
  let component: PoPreparationComponent;
  let fixture: ComponentFixture<PoPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
