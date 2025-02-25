import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTransferComponent } from './data-transfer.component';

const routes: Routes = [
  {
    path: "",
    component: DataTransferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTransferRoutingModule { }
