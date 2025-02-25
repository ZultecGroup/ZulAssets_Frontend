import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationGroupsRoutingModule } from './organization-groups-routing.module';
import { OrganizationGroupsComponent } from './organization-groups.component';
import { AddUpdateOrganizationGroupComponent } from './add-update-organization-group/add-update-organization-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    OrganizationGroupsComponent,
    AddUpdateOrganizationGroupComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    OrganizationGroupsRoutingModule,
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
export class OrganizationGroupsModule { }
