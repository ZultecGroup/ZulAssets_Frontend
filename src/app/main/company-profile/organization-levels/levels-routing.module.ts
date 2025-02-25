import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelsComponent } from './levels.component';
import { AddUpdateLevelsComponent } from './add-update-lelvels/add-update-levels.component';
// import { AddUpdateCostCentersComponent } from './add-update-cost-centers/add-update-cost-centers.component';

const routes: Routes = [
  {
    path: "",
    component: LevelsComponent
  },
  {
    path: "create",
    component: AddUpdateLevelsComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateLevelsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelsRoutingModule { }
