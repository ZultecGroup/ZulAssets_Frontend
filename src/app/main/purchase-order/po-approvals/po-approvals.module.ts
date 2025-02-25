import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoApprovalsRoutingModule } from './po-approvals-routing.module';
import { PoApprovalsComponent } from './po-approvals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    PoApprovalsComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    PoApprovalsRoutingModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    SharedModule
  ]
})
export class PoApprovalsModule { }
