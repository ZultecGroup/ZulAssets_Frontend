import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetItemsComponent } from './asset-items.component';
import { AddUpdateAssetItemComponent } from './add-update-asset-item/add-update-asset-item.component';

const routes: Routes = [
  {
    path: "",
    component: AssetItemsComponent
  },
  {
    path: "create",
    component: AddUpdateAssetItemComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateAssetItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetItemsRoutingModule { }
