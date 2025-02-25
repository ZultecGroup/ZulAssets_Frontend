import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressTemplatesRoutingModule } from './address-templates-routing.module';
import { AddressTemplatesComponent } from './address-templates.component';
import { AddUpdateAddressTemplateComponent } from './add-update-address-template/add-update-address-template.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    AddressTemplatesComponent,
    AddUpdateAddressTemplateComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    AddressTemplatesRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    PDFModule,
    ExcelModule,
    SharedModule
  ]
})
export class AddressTemplatesModule { }
