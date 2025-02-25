import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationUsersRoutingModule } from './application-users-routing.module';
import { ApplicationUsersComponent } from './application-users.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CreateApplicationUserComponent } from './create-application-user/create-application-user.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SharedModule } from '../../shared/shared.module';
import { IconsModule } from '@progress/kendo-angular-icons';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [ApplicationUsersComponent, CreateApplicationUserComponent],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    ApplicationUsersRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    ReactiveFormsModule,
    IndicatorsModule,
    SharedModule,
    IconsModule,
  ],
})
export class ApplicationUsersModule {}
