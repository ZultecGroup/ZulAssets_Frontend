import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationHierarchyComponent } from './organization-hierarchy.component';
import { LevelsRoutingModule } from './organization-hierarchy-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AddUpdateOrganizationHierarchyComponent } from './add-update-organization-hierarchy/add-update-organization-hierarchy.component';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTreeModule} from '@angular/material/tree';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
@NgModule({
  declarations: [
    OrganizationHierarchyComponent,
    AddUpdateOrganizationHierarchyComponent
  ],
  imports: [
    CommonModule,
    LevelsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    DialogsModule
  ]
})
export class OrganizationHierarchyModule { }
