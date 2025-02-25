import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { AssetItemsRoutingModule } from './asset-items-routing.module';
import { AssetItemsComponent } from './asset-items.component';
import { AddUpdateAssetItemComponent } from './add-update-asset-item/add-update-asset-item.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { MatTreeSelectInputModule } from 'mat-tree-select-input';


@NgModule({
  declarations: [
    AssetItemsComponent,
    AddUpdateAssetItemComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    AssetItemsRoutingModule,
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
    MatTreeSelectInputModule,

  ]
})
export class AssetItemsModule { }
