import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepreciationPolicyComponent } from './depreciation-policy.component';

const routes: Routes = [
  {
    path: '',
    component: DepreciationPolicyComponent
  },
  // {
  //   path: 'create',
  //   component: AddUpdateAssetsCodingDefinitionComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciationPolicyRoutingModule { }
