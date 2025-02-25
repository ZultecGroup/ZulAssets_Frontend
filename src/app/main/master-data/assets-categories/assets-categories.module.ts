import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsCategoriesRoutingModule } from './assets-categories-routing.module';
import { AssetsCategoriesComponent } from './assets-categories.component';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { DialogsModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
@NgModule({
  declarations: [AssetsCategoriesComponent],
  exports: [AssetsCategoriesComponent],
  imports: [
    CommonModule,
    AssetsCategoriesRoutingModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ButtonsModule,
    DialogsModule,
    LabelModule,
    InputsModule,
    ButtonModule,
    GridModule,
    TreeViewModule,
    DropDownsModule,
    LoaderModule,
  ],
})
export class AssetsCategoriesModule {}
