import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRolesComponent } from './user-roles.component';
import { AddUpdateRolesComponent } from './add-update-roles/add-update-roles.component';

const routes: Routes = [
  {
    path: '',
    component: UserRolesComponent
  },
  {
    path: 'create',
    component: AddUpdateRolesComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateRolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRolesRoutingModule { }
