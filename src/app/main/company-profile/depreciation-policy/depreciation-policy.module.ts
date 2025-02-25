import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepreciationPolicyComponent } from './depreciation-policy.component';
import { DepreciationPolicyRoutingModule } from './depreciation-policy-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTreeModule} from '@angular/material/tree';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { AssetsCategoriesModule } from '../../master-data/assets-categories/assets-categories.module';


@NgModule({
  declarations: [
    DepreciationPolicyComponent,

  ],
  imports: [
    CommonModule,
    DepreciationPolicyRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    LabelModule,
    DropDownsModule,
    IndicatorsModule,
    DialogsModule,
    DateInputsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    AssetsCategoriesModule
  ]
})
export class DepreciationPolicyModule { }
