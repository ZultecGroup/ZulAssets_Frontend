import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationHierarchyComponent } from './organization-hierarchy.component';

describe('LevelsComponent', () => {
  let component: OrganizationHierarchyComponent;
  let fixture: ComponentFixture<OrganizationHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
