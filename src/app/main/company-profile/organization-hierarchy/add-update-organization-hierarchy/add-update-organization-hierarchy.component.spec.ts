import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateOrganizationHierarchyComponent } from './add-update-organization-hierarchy.component';



describe('AddUpdateCostCentersComponent', () => {
  let component: AddUpdateOrganizationHierarchyComponent;
  let fixture: ComponentFixture<AddUpdateOrganizationHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateOrganizationHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateOrganizationHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
