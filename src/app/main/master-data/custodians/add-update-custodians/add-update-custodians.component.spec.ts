import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCustodiansComponent } from './add-update-custodians.component';

describe('AddUpdateCustodiansComponent', () => {
  let component: AddUpdateCustodiansComponent;
  let fixture: ComponentFixture<AddUpdateCustodiansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateCustodiansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCustodiansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
