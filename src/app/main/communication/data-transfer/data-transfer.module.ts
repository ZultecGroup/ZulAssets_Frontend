import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTransferRoutingModule } from './data-transfer-routing.module';
import { DataTransferComponent } from './data-transfer.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';


@NgModule({
  declarations: [
    DataTransferComponent
  ],
  imports: [
    CommonModule,
    DataTransferRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DataTransferModule { }
