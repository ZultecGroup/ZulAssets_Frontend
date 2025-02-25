import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustodiansComponent } from './custodians.component';
import { AddUpdateCustodiansComponent } from './add-update-custodians/add-update-custodians.component';

const routes: Routes = [
  {
    path: '',
    component: CustodiansComponent
  },
  {
    path: 'create',
    component: AddUpdateCustodiansComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateCustodiansComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustodiansRoutingModule { }
