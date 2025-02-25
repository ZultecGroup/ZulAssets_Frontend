import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterCompanyTransferRoutingModule } from './inter-company-transfer-routing.module';
import { InterCompanyTransferComponent } from './inter-company-transfer.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { AgGridModule } from 'ag-grid-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    InterCompanyTransferComponent
  ],
  imports: [
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    CommonModule,
    InterCompanyTransferRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    DateInputsModule,
    SharedModule,
    DialogModule
  ]
})
export class InterCompanyTransferModule { }
