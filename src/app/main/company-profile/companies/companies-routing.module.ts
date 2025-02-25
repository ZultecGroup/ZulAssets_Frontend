import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies.component';
import { AddUpdateCompaniesComponent } from './add-update-companies/add-update-companies.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent
  },
  {
    path: 'create',
    component: AddUpdateCompaniesComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateCompaniesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
