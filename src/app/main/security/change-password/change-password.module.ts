import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from "@progress/kendo-angular-label";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    ReactiveFormsModule,
    IndicatorsModule,
    SharedModule
  ]
})
export class ChangePasswordModule { }
