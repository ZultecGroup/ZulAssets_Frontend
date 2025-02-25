import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersComponent } from './suppliers.component';
import { AddUpdateSuppliersComponent } from './add-update-suppliers/add-update-suppliers.component';

const routes: Routes = [
  {
    path: "",
    component: SuppliersComponent
  },
  {
    path: "create",
    component: AddUpdateSuppliersComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateSuppliersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
