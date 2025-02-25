import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "designations",
    loadChildren: () => import('src/app/main/master-data/designations/designations.module').then((m) => m.DesignationsModule)
  },
  {
    path: "address-templates",
    loadChildren: () => import('src/app/main/master-data/address-templates/address-templates.module').then((m) => m.AddressTemplatesModule)
  },
  {
    path: "brands",
    loadChildren: () => import('src/app/main/master-data/brands/brands.module').then((m) => m.BrandsModule)
  },
  {
    path: "gl-codes",
    loadChildren: () => import('src/app/main/master-data/gl-codes/gl-codes.module').then((m) => m.GlCodesModule)
  },
  {
    path: "insurers",
    loadChildren: () => import('src/app/main/master-data/insurers/insurers.module').then((m) => m.InsurersModule)
  },
  {
    path: "suppliers",
    loadChildren: () => import('src/app/main/master-data/suppliers/suppliers.module').then((m) => m.SuppliersModule)
  },
  {
    path: "depreciation-methods",
    loadChildren: () => import('src/app/main/master-data/depreciation-methods/depreciation-methods.module').then((m) => m.DepreciationMethodsModule)
  },
  {
    path: "disposal-methods",
    loadChildren: () => import('src/app/main/master-data/disposal-methods/disposal-methods.module').then((m) => m.DisposalMethodsModule)
  },
  {
    path: "units",
    loadChildren: () => import('src/app/main/master-data/units/units.module').then((m) => m.UnitsModule)
  },
  {
    path: "inventory-schedules",
    loadChildren: () => import('src/app/main/master-data/inventory-schedules/inventory-schedules.module').then((m) => m.InventorySchedulesModule)
  },
  {
    path: "cost-centers",
    loadChildren: () => import('src/app/main/master-data/cost-centers/cost-centers.module').then((m) => m.CostCentersModule)
  },
  {
    path: "asset-items",
    loadChildren: () => import('src/app/main/master-data/asset-items/asset-items.module').then((m) => m.AssetItemsModule)
  },
  {
    path: "asset-book",
    loadChildren: () => import('src/app/main/master-data/asset-books/asset-books.module').then((m) => m.AssetBooksModule)
  },
  {
    path: "assets-categories",
    loadChildren: () => import('src/app/main/master-data/assets-categories/assets-categories.module').then((m) => m.AssetsCategoriesModule)
  },
  {
    path: "custodians",
    loadChildren: () => import('src/app/main/master-data/custodians/custodians.module').then((m) => m.CustodiansModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
