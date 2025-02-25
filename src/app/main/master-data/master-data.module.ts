import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    SharedModule
    
  ]
})
export class MasterDataModule { }
