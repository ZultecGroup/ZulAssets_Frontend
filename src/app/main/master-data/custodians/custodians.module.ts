import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustodiansRoutingModule } from './custodians-routing.module';
import { CustodiansComponent } from './custodians.component';
import { AddUpdateCustodiansComponent } from './add-update-custodians/add-update-custodians.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { MatTreeSelectInputModule } from 'mat-tree-select-input';


@NgModule({
  declarations: [
    CustodiansComponent,
    AddUpdateCustodiansComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    CustodiansRoutingModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    PDFModule,
    ExcelModule,
    SharedModule,
    MatTreeSelectInputModule,
  ]
})
export class CustodiansModule { }
