import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignationsComponent } from './designations.component';
import { AddUpdateDesignationComponent } from './add-update-designation/add-update-designation.component';

const routes: Routes = [
  {
    path: '',
    component: DesignationsComponent
  },
  {
    path: 'create',
    component: AddUpdateDesignationComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateDesignationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationsRoutingModule { }
