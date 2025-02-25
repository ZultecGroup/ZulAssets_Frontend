import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoPreparationComponent } from './po-preparation.component';

const routes: Routes = [
  {
    path: '',
    component: PoPreparationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoPreparationRoutingModule { }
