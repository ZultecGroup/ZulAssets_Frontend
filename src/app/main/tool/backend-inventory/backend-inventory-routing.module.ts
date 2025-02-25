import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackendInventoryComponent } from './backend-inventory.component';


const routes: Routes = [
  {
    path: "",
    component: BackendInventoryComponent
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
export class BackendInventoryRoutingModule { }
