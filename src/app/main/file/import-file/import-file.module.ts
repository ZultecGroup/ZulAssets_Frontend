import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportFileComponent } from './import-file.component';
import { SharedModule } from '../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { RouterModule, Routes } from '@angular/router';
const routes:Routes = [
  {
    path: '',
    component:ImportFileComponent
  }
]


@NgModule({
  declarations: [
    ImportFileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class ImportFileModule { }
