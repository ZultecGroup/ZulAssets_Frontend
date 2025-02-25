import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsCodingDefinitionRoutingModule } from './assets-coding-definition-routing.module';
import { AssetsCodingDefinitionComponent } from './assets-coding-definition.component';
import { AddUpdateAssetsCodingDefinitionComponent } from './add-update-assets-coding-definition/add-update-assets-coding-definition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { SharedModule } from '../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AssetsCodingDefinitionComponent,
    AddUpdateAssetsCodingDefinitionComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    AssetsCodingDefinitionRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AssetsCodingDefinitionModule { }
