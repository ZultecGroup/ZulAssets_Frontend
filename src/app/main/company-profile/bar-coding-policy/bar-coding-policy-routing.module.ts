import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarCodingPolicyComponent } from './bar-coding-policy.component';
import { AddUpdateBarcodePolicyComponent } from './add-update-barcode-policy/add-update-barcode-policy.component';

const routes: Routes = [
  {
    path: '',
    component: BarCodingPolicyComponent
  },
  {
    path: 'create',
    component: AddUpdateBarcodePolicyComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateBarcodePolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarCodingPolicyRoutingModule { }
