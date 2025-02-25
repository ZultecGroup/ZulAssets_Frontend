import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisposalMethodsComponent } from './disposal-methods.component';
import { AddUpdateDisposalMethodsComponent } from './add-update-disposal-methods/add-update-disposal-methods.component';

const routes: Routes = [
  {
    path: "",
    component: DisposalMethodsComponent
  },
  {
    path: "create",
    component: AddUpdateDisposalMethodsComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateDisposalMethodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisposalMethodsRoutingModule { }
