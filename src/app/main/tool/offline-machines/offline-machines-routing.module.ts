import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfflineMachinesComponent } from './offline-machines.component';


const routes: Routes = [
  {
    path: "",
    component: OfflineMachinesComponent
  },
  // {
  //   path: 'create',
  //   component: AddUpdateBarPolicyStructureComponent
  // },
  // {
  //   path: 'edit/:id',
  //   component: AddUpdateBarPolicyStructureComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineMachinesRoutingModule { }
