import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { AddUpdateBrandsComponent } from './add-update-brands/add-update-brands.component';

const routes: Routes = [
  {
    path: "",
    component: BrandsComponent
  },
  {
    path: "create",
    component: AddUpdateBrandsComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateBrandsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
