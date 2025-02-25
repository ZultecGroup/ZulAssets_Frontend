import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisposalMethodsRoutingModule } from './disposal-methods-routing.module';
import { DisposalMethodsComponent } from './disposal-methods.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { AddUpdateDisposalMethodsComponent } from './add-update-disposal-methods/add-update-disposal-methods.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    DisposalMethodsComponent,
    AddUpdateDisposalMethodsComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    DisposalMethodsRoutingModule,
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
export class DisposalMethodsModule { }
