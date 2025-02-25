import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssitsInTransitComponent } from './assets-in-transit.component';
import { TransferFormComponent } from './transfer-form/transfer-form.component';

const routes: Routes = [
  {
    path: '',
    component: AssitsInTransitComponent,
  },
  {
    path: 'transfer',
    component: TransferFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsInTransitRoutingModule {}
