import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsurersComponent } from './insurers.component';
import { AddUpdateInsurersComponent } from './add-update-insurers/add-update-insurers.component';

const routes: Routes = [
  {
    path: "",
    component: InsurersComponent
  },
  {
    path: "create",
    component: AddUpdateInsurersComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateInsurersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurersRoutingModule { }
