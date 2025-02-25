import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceConfigurationComponent } from './device-configuration.component';
import { AddDeviceConfigComponent } from './add-device-config/add-device-config.component';

const routes: Routes = [
  {
    path: "",
    component: DeviceConfigurationComponent
  }, {
    path: 'edit/:id',
    component: AddDeviceConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceConfigurationRoutingModule { }
