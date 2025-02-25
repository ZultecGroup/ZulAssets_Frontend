import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventorySchedulesComponent } from './inventory-schedules.component';
import { AddUpdateInventorySchedulesComponent } from './add-update-inventory-schedules/add-update-inventory-schedules.component';

const routes: Routes = [
  {
    path: "",
    component: InventorySchedulesComponent
  },
  {
    path: "create",
    component: AddUpdateInventorySchedulesComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateInventorySchedulesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventorySchedulesRoutingModule { }
