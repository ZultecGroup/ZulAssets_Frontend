import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsComponent } from './locations.component';
import { LocationsRoutingModule } from './locations-routing.module';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUpdateLocationsComponent } from './add-update-locations/add-update-locations.component';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [LocationsComponent, AddUpdateLocationsComponent],
  exports: [LocationsComponent],
  imports: [
    CommonModule,
    LocationsRoutingModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    LoaderModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    DialogsModule,
    DragDropModule,
    MatCheckboxModule,

  ],
})
export class LocationsModule {}
