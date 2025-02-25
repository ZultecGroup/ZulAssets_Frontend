import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyInfoComponent } from './company-info.component';
import { AddUpdateCompanyInfoComponent } from './add-update-company-info/add-update-company-info.component';

const routes: Routes = [
  {
    path: "",
    component: CompanyInfoComponent
  },
  {
    path: "create",
    component: AddUpdateCompanyInfoComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateCompanyInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyInfoRoutingModule { }
