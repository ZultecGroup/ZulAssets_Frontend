import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsComponent } from './levels.component';
import { LevelsRoutingModule } from './levels-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { AddUpdateLevelsComponent } from './add-update-lelvels/add-update-levels.component';
import { SharedModule } from '../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    LevelsComponent,
    AddUpdateLevelsComponent
  ],
  imports: [
    CommonModule,
    LevelsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    SharedModule,
    AgGridModule,
    NgbPagination
  ]
})
export class LevelsModule { }
