import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsInTransitRoutingModule } from './assets-in-transit-routing.module';
import { AssitsInTransitComponent } from './assets-in-transit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { SharedModule } from '../../shared/shared.module';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TransferFormComponent } from './transfer-form/transfer-form.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [AssitsInTransitComponent, TransferFormComponent],
  imports: [
    CommonModule,
    AgGridModule,
    NgbPaginationModule,
    FormsModule,
    AssetsInTransitRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    DateInputsModule,
    SharedModule,
    DialogModule,
  ],
})
export class AssetsInTransitModule {}
