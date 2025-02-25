import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeStructureComponent } from './barcode-structure.component';
import { AddUpdateBarPolicyStructureComponent } from './add-update-bar-policy-structure/add-update-bar-policy-structure.component';

const routes: Routes = [
  {
    path: "",
    component: BarcodeStructureComponent
  },
  {
    path: 'create',
    component: AddUpdateBarPolicyStructureComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateBarPolicyStructureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarcodeStructureRoutingModule { }
