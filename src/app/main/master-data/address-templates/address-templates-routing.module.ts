import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressTemplatesComponent } from './address-templates.component';
import { AddUpdateAddressTemplateComponent } from './add-update-address-template/add-update-address-template.component';

const routes: Routes = [
  {
    path: '',
    component: AddressTemplatesComponent
  },
  {
    path: 'create',
    component: AddUpdateAddressTemplateComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateAddressTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressTemplatesRoutingModule { }
