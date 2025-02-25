import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoPreparationRoutingModule } from './po-preparation-routing.module';
import { PoPreparationComponent } from './po-preparation.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    PoPreparationComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    PoPreparationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    DialogsModule,
    DateInputsModule,
    SharedModule
  ]
})
export class PoPreparationModule { }
