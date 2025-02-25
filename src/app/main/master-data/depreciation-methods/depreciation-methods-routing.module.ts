import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepreciationMethodsComponent } from './depreciation-methods.component';
import { AddUpdateDepreciationMethodsComponent } from './add-update-depreciation-methods/add-update-depreciation-methods.component';

const routes: Routes = [
  {
    path: "",
    component: DepreciationMethodsComponent
  },
  {
    path: "create",
    component: AddUpdateDepreciationMethodsComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateDepreciationMethodsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciationMethodsRoutingModule { }
