import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateLocationsComponent } from './add-update-locations/add-update-locations.component';
import { LocationsComponent } from './locations.component';


const routes: Routes = [
  {
    path: '',
    component: LocationsComponent
  },
  {
    path: 'create',
    component: AddUpdateLocationsComponent
  },
  // {
  //   path: 'edit/:id',
  //   component: AddUpdateCompaniesComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
