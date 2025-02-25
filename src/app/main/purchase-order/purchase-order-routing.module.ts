import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "po-preparation",
    loadChildren: () => import('src/app/main/purchase-order/po-preparation/po-preparation.module').then((m) => m.PoPreparationModule)
  },
  {
    path: "po-approvals",
    loadChildren: () => import('src/app/main/purchase-order/po-approvals/po-approvals.module').then((m) => m.PoApprovalsModule)
  },
  {
    path: "assets-in-transit",
    loadChildren: () => import('src/app/main/purchase-order/assets-in-transit/assets-in-transit.module').then((m) => m.AssetsInTransitModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
