import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { QuarterlyPhysicalReportComponent } from './quarterly-physical-report.component';

const routes: Routes = [
  {
    path: "",
    component: QuarterlyPhysicalReportComponent
  }
]

@NgModule({
  declarations: [
    QuarterlyPhysicalReportComponent,
  ],
imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
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
    PDFExportModule,
    ExcelExportModule
  ]
})
export class QuarterlyPhysicalReportModule { }
