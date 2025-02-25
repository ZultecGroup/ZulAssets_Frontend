import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyInfoRoutingModule } from './company-info-routing.module';
import { CompanyInfoComponent } from './company-info.component';
import { AddUpdateCompanyInfoComponent } from './add-update-company-info/add-update-company-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    CompanyInfoComponent,
    AddUpdateCompanyInfoComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    CompanyInfoRoutingModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    SharedModule
  ]
})
export class CompanyInfoModule { }
