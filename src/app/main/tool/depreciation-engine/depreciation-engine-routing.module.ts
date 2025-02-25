import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepreciationEngineComponent } from './depreciation-engine.component';

const routes: Routes = [
  {
    path: "",
    component: DepreciationEngineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciationEngineRoutingModule { }
