import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDisposalMethodsComponent } from './add-update-disposal-methods.component';

describe('AddUpdateDisposalMethodsComponent', () => {
  let component: AddUpdateDisposalMethodsComponent;
  let fixture: ComponentFixture<AddUpdateDisposalMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDisposalMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDisposalMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
