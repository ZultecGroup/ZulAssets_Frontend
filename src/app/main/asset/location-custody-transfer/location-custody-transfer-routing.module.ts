import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationCustodyTransferComponent } from './location-custody-transfer.component';

const routes: Routes = [
  {
    path: "",
    component: LocationCustodyTransferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationCustodyTransferRoutingModule { }
