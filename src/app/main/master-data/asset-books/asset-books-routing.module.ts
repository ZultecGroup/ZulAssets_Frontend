import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetBooksComponent } from './asset-books.component';
import { AddUpdateAssetBookComponent } from './add-update-asset-book/add-update-asset-book.component';

const routes: Routes = [
  {
    path: "",
    component: AssetBooksComponent
  },
  {
    path: "create",
    component: AddUpdateAssetBookComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateAssetBookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetBooksRoutingModule { }
