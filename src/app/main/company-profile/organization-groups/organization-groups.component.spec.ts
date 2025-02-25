import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationGroupsComponent } from './organization-groups.component';

describe('OrganizationGroupsComponent', () => {
  let component: OrganizationGroupsComponent;
  let fixture: ComponentFixture<OrganizationGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
