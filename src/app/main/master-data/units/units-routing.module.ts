import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitsComponent } from './units.component';
import { AddUpdateUnitsComponent } from './add-update-units/add-update-units.component';


const routes: Routes = [
  {
    path: "",
    component: UnitsComponent
  },
  {
    path: "create",
    component: AddUpdateUnitsComponent
  },
  {
    path: "edit/:id",
    component: AddUpdateUnitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule { }
