import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBarPolicyStructureComponent } from './add-update-bar-policy-structure.component';

describe('AddUpdateBarPolicyStructureComponent', () => {
  let component: AddUpdateBarPolicyStructureComponent;
  let fixture: ComponentFixture<AddUpdateBarPolicyStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBarPolicyStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBarPolicyStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
