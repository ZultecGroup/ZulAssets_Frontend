import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    SharedModule
  ]
})
export class SecurityModule { }
