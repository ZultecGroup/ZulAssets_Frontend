import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationHierarchyComponent } from './organization-hierarchy.component';
import { AddUpdateOrganizationHierarchyComponent } from './add-update-organization-hierarchy/add-update-organization-hierarchy.component';
// import { AddUpdateCostCentersComponent } from './add-update-cost-centers/add-update-cost-centers.component';

const routes: Routes = [
  {
    path: "",
    component: OrganizationHierarchyComponent
  },
  {
    path: "create",
    component: AddUpdateOrganizationHierarchyComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateOrganizationHierarchyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelsRoutingModule { }
