import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendInventoryComponent } from './backend-inventory.component';
import { BackendInventoryRoutingModule } from './backend-inventory-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    BackendInventoryComponent
  ],
  imports: [
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    CommonModule,
    BackendInventoryRoutingModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    DateInputsModule,
    SharedModule
  ]
})
export class BackendInventoryModule { }
