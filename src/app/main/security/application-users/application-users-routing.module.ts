import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationUsersComponent } from './application-users.component';
import { CreateApplicationUserComponent } from './create-application-user/create-application-user.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationUsersComponent
  },
  {
    path: 'create',
    component: CreateApplicationUserComponent
  },
  {
    path: 'edit/:id',
    component: CreateApplicationUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationUsersRoutingModule { }
