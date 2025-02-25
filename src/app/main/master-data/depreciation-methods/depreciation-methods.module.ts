import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepreciationMethodsRoutingModule } from './depreciation-methods-routing.module';
import { DepreciationMethodsComponent } from './depreciation-methods.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { AddUpdateDepreciationMethodsComponent } from './add-update-depreciation-methods/add-update-depreciation-methods.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    DepreciationMethodsComponent,
    AddUpdateDepreciationMethodsComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    DepreciationMethodsRoutingModule,
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
    SharedModule
  ]
})
export class DepreciationMethodsModule { }
