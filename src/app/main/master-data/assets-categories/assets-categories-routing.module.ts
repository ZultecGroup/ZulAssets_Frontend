import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsCategoriesComponent } from './assets-categories.component';

const routes: Routes = [
  {
    path: '',
    component:AssetsCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsCategoriesRoutingModule { }
