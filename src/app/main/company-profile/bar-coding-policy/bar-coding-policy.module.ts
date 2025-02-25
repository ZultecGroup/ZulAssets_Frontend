import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarCodingPolicyRoutingModule } from './bar-coding-policy-routing.module';
import { BarCodingPolicyComponent } from './bar-coding-policy.component';
import { AddUpdateBarcodePolicyComponent } from './add-update-barcode-policy/add-update-barcode-policy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { SharedModule } from '../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    BarCodingPolicyComponent,
    AddUpdateBarcodePolicyComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    BarCodingPolicyRoutingModule,
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
export class BarCodingPolicyModule { }
