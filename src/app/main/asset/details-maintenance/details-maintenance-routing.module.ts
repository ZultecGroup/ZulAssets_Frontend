import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsMaintenanceComponent } from './details-maintenance.component';

const routes: Routes = [
  {
    path: "",
    component: DetailsMaintenanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsMaintenanceRoutingModule { }
