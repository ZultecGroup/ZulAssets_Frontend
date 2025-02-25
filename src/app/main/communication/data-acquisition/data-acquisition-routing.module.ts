import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataAcquisitionComponent } from './data-acquisition.component';

const routes: Routes = [
  {
    path: "",
    component: DataAcquisitionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataAcquisitionRoutingModule { }
