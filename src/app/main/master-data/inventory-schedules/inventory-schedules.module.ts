import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventorySchedulesRoutingModule } from './inventory-schedules-routing.module';
import { InventorySchedulesComponent } from './inventory-schedules.component';
import { AddUpdateInventorySchedulesComponent } from './add-update-inventory-schedules/add-update-inventory-schedules.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { LocationsModule } from '../../company-profile/locations/locations.module';


@NgModule({
  declarations: [
    InventorySchedulesComponent,
    AddUpdateInventorySchedulesComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    InventorySchedulesRoutingModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    DateInputsModule,
    PDFModule,
    ExcelModule,
    SharedModule,
    LocationsModule,

  ]
})
export class InventorySchedulesModule { }
