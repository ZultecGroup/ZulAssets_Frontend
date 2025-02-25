import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsMaintenanceRoutingModule } from './details-maintenance-routing.module';
import { DetailsMaintenanceComponent } from './details-maintenance.component';
import { AdditionalCostHistoryComponent } from './additional-cost-history/additional-cost-history.component';
import { AssetsInformationComponent } from './assets-information/assets-information.component';
import { CustodianHistoryComponent } from './custodian-history/custodian-history.component';
import { DepreciationInformationComponent } from './depreciation-information/depreciation-information.component';
import { DisposalOrSalesInformationComponent } from './disposal-or-sales-information/disposal-or-sales-information.component';
import { ExtendedInformationComponent } from './extended-information/extended-information.component';
import { ExtendedWarrantyComponent } from './extended-warranty/extended-warranty.component';
import { TrackingHistoryComponent } from './tracking-history/tracking-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IconsModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ApplicationUsersRoutingModule } from '../../security/application-users/application-users-routing.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DetailMaintenanceService } from './detail-maintenance.service';
import { SharedModule } from '../../shared/shared.module';
import { IntlModule } from "@progress/kendo-angular-intl";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    DetailsMaintenanceComponent,
    AdditionalCostHistoryComponent,
    AssetsInformationComponent,
    CustodianHistoryComponent,
    DepreciationInformationComponent,
    DisposalOrSalesInformationComponent,
    ExtendedInformationComponent,
    ExtendedWarrantyComponent,
    TrackingHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    NgbPaginationModule,
    DetailsMaintenanceRoutingModule,
    LayoutModule,
    IconsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    DropDownsModule,
    GridModule,
    CommonModule,
    ApplicationUsersRoutingModule,
    ButtonModule,
    TreeViewModule,
    ReactiveFormsModule,
    IndicatorsModule,
    DateInputsModule,
    SharedModule,
    IntlModule
  ],
  providers: [DetailMaintenanceService]
})
export class DetailsMaintenanceModule { }
