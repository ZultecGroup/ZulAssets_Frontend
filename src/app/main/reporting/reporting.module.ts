import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    SharedModule
  ]
})
export class ReportingModule { }
