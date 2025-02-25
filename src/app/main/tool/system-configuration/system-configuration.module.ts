import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemConfigurationRoutingModule } from './system-configuration-routing.module';
import { SystemConfigurationComponent } from './system-configuration.component';
import { GeneralComponent } from './general/general.component';
import { PrintingComponent } from './printing/printing.component';
import { AssetImagesComponent } from './asset-images/asset-images.component';
import { AssetsDescriptionComponent } from './assets-description/assets-description.component';
import { ToolsComponent } from './tools/tools.component';
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
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    SystemConfigurationComponent,
    GeneralComponent,
    PrintingComponent,
    AssetImagesComponent,
    AssetsDescriptionComponent,
    ToolsComponent
  ],
  imports: [
    CommonModule,
    SystemConfigurationRoutingModule,
    FormsModule,
    LayoutModule,
    IconsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    DropDownsModule,
    GridModule,
    ButtonModule,
    TreeViewModule,
    ReactiveFormsModule,
    IndicatorsModule,
    DateInputsModule,
    SharedModule
  ]
})
export class SystemConfigurationModule { }
