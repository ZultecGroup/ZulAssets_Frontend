import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  }
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoaderModule,
    SharedModule
    
  ]
})
export class DashboardModule { }
