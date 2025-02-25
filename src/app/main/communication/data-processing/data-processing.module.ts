import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataProcessingComponent } from './data-processing.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
const routes:Routes = [
  {
    path: '',
    component:DataProcessingComponent
  }
]

@NgModule({
  declarations: [
    DataProcessingComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    DateInputsModule,
    SharedModule,
    FormsModule 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DataProcessingModule { }
