import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardReportsComponent } from './standard-reports.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

const routes: Routes = [
  {
    path: "",
    component: StandardReportsComponent
  }
]

@NgModule({
  declarations: [
    StandardReportsComponent
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
    DateInputsModule
  ]
})
export class StandardReportsModule { }
