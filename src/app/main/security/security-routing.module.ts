import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: "application-users",
    loadChildren: () => import('src/app/main/security/application-users/application-users.module').then((m) => m.ApplicationUsersModule)
  },
  {
    path: "user-roles",
    loadChildren: () => import('src/app/main/security/user-roles/user-roles.module').then((m) => m.UserRolesModule)
  },
  {
    path: "change-password",
    loadChildren: () => import('src/app/main/security/change-password/change-password.module').then((m) => m.ChangePasswordModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
