import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { UserRolesComponent } from './user-roles.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
// import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { AddUpdateRolesComponent } from './add-update-roles/add-update-roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { SharedModule } from '../../shared/shared.module';
// import { BrowserModule } from '@angular/platform-browser';
// import { ReactiveFormsModule } from '@angular/forms/forms';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {BehaviorSubject} from 'rxjs';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    UserRolesComponent,
    AddUpdateRolesComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    UserRolesRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    SharedModule,
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class UserRolesModule { }
