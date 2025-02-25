import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousAssetsComponent } from './anonymous-assets.component';

const routes: Routes = [
  {
    path: "",
    component: AnonymousAssetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousAssetsRoutingModule { }
