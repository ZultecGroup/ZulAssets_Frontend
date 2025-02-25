import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: "data-acquisition",
  //   loadChildren: () => import('src/app/main/communication/data-acquisition/data-acquisition.module').then((m) => m.DataAcquisitionModule)
  // },
  // {
  //   path: "data-transfer",
  //   loadChildren: () => import('src/app/main/communication/data-transfer/data-transfer.module').then((m) => m.DataTransferModule)
  // },
  {
    path: "data-processing",
    loadChildren: () => import('src/app/main/communication/data-processing/data-processing.module').then((m) => m.DataProcessingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
