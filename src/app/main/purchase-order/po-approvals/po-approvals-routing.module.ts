import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoApprovalsComponent } from './po-approvals.component';

const routes: Routes = [
  {
    path: '',
    component: PoApprovalsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoApprovalsRoutingModule { }
