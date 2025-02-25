import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarrantyAlarmComponent } from './warranty-alarm.component';

const routes: Routes = [
  {
    path: '',
    component: WarrantyAlarmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarrantyAlarmRoutingModule { }
