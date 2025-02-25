import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LocationsModule } from '../../company-profile/locations/locations.module';
import { AssetsCategoriesModule } from '../../master-data/assets-categories/assets-categories.module';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AdministrationComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    AdministrationRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    LocationsModule,
    AssetsCategoriesModule,
    DragDropModule,
  ]
})
export class AdministrationModule { }
