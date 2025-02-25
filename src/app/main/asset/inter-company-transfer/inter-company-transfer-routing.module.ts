import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterCompanyTransferComponent } from './inter-company-transfer.component';

const routes: Routes = [
  {
    path: "",
    component: InterCompanyTransferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterCompanyTransferRoutingModule { }
