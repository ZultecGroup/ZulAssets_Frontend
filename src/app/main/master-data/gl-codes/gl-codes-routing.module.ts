import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlCodesComponent } from './gl-codes.component';
import { AddUpdateGlCodesComponent } from './add-update-gl-codes/add-update-gl-codes.component';

const routes: Routes = [
  {
    path: "",
    component: GlCodesComponent
  },
  {
    path: "create",
    component: AddUpdateGlCodesComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateGlCodesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlCodesRoutingModule { }
