import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousAssetsRoutingModule } from './anonymous-assets-routing.module';
import { AnonymousAssetsComponent } from './anonymous-assets.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AnonymousAssetsComponent
  ],
  imports: [
    CommonModule,
    AnonymousAssetsRoutingModule,
    SharedModule
  ]
})
export class AnonymousAssetsModule { }
