import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "company-info",
    loadChildren: () => import('src/app/main/tool/company-info/company-info.module').then((m) => m.CompanyInfoModule)
  },
  {
    path: "barcode-structure",
    loadChildren: () => import('src/app/main/tool/barcode-structure/barcode-structure.module').then((m) => m.BarcodeStructureModule)
  },
  {
    path: "system-configuration",
    loadChildren: () => import('src/app/main/tool/system-configuration/system-configuration.module').then((m) => m.SystemConfigurationModule)
  },
  {
    path: "device-configuration",
    loadChildren: () => import('src/app/main/tool/device-configuration/device-configuration.module').then((m) => m.DeviceConfigurationModule)
  },
  {
    path: "depreciation-engine",
    loadChildren: () => import('src/app/main/tool/depreciation-engine/depreciation-engine.module').then((m) => m.DepreciationEngineModule)
  },
  {
    path: "backend-inventory",
    loadChildren: () => import('src/app/main/tool/backend-inventory/backend-inventory.module').then((m) => m.BackendInventoryModule)
  },
  {
    path: "offline-machines",
    loadChildren: () => import('src/app/main/tool/offline-machines/offline-machines.module').then((m) => m.OfflineMachinesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolRoutingModule { }
