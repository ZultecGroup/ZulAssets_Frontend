import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineMachinesComponent } from './offline-machines.component';
import { OfflineMachinesRoutingModule } from './offline-machines-routing.module';



@NgModule({
  declarations: [
    OfflineMachinesComponent
  ],
  imports: [
    CommonModule,
    OfflineMachinesRoutingModule
  ]
})
export class OfflineMachinesModule { }
