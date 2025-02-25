import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsCategoriesComponent } from '../../master-data/assets-categories/assets-categories.component';
import { AddUpdateAssetsCodingDefinitionComponent } from './add-update-assets-coding-definition/add-update-assets-coding-definition.component';
import { AssetsCodingDefinitionComponent } from './assets-coding-definition.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsCodingDefinitionComponent
  },
  {
    path: 'create',
    component: AddUpdateAssetsCodingDefinitionComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateAssetsCodingDefinitionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsCodingDefinitionRoutingModule { }
