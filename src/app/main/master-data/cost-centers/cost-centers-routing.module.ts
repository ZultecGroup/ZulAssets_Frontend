import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCentersComponent } from './cost-centers.component';
import { AddUpdateCostCentersComponent } from './add-update-cost-centers/add-update-cost-centers.component';

const routes: Routes = [
  {
    path: "",
    component: CostCentersComponent
  },
  {
    path: "create",
    component: AddUpdateCostCentersComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateCostCentersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostCentersRoutingModule { }
