import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "administration",
    loadChildren: () => import('src/app/main/asset/administration/administration.module').then((m) => m.AdministrationModule)
  },
  {
    path: "anonymous-assets",
    loadChildren: () => import('src/app/main/asset/anonymous-assets/anonymous-assets.module').then((m) => m.AnonymousAssetsModule)
  },
  {
    path: "details-maintenance",
    loadChildren: () => import('src/app/main/asset/details-maintenance/details-maintenance.module').then((m) => m.DetailsMaintenanceModule)
  },
  {
    path: "inter-company-transfer",
    loadChildren: () => import('src/app/main/asset/inter-company-transfer/inter-company-transfer.module').then((m) => m.InterCompanyTransferModule)
  },
  {
    path: "location-custody-transfer",
    loadChildren: () => import('src/app/main/asset/location-custody-transfer/location-custody-transfer.module').then((m) => m.LocationCustodyTransferModule)
  },
  {
    path: "search",
    loadChildren: () => import('src/app/main/asset/search/search.module').then((m) => m.SearchModule)
  },
  {
    path: "warranty-alarm",
    loadChildren: () => import('src/app/main/asset/warranty-alarm/warranty-alarm.module').then((m) => m.WarrantyAlarmModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
