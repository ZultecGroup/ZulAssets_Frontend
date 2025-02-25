import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationGroupsComponent } from './organization-groups.component';
import { AddUpdateOrganizationGroupComponent } from './add-update-organization-group/add-update-organization-group.component';

const routes: Routes = [
  {
    path: "",
    component: OrganizationGroupsComponent
  },
  {
    path: 'create',
    component: AddUpdateOrganizationGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationGroupsRoutingModule { }
