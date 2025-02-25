import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "companies",
    loadChildren: () => import('src/app/main/company-profile/companies/companies.module').then((m) => m.CompaniesModule)
  },
  {
    path: "locations",
    loadChildren: () => import('src/app/main/company-profile/locations/locations.module').then((m) => m.LocationsModule)
  },
  {
    path: "bar-coding-policy",
    loadChildren: () => import('src/app/main/company-profile/bar-coding-policy/bar-coding-policy.module').then((m) => m.BarCodingPolicyModule)
  },
  {
    path: "assets-coding-definition",
    loadChildren: () => import('src/app/main/company-profile/assets-coding-definition/assets-coding-definition.module').then((m) => m.AssetsCodingDefinitionModule)
  },
  {
    path: "organization-groups",
    loadChildren: () => import('src/app/main/company-profile/organization-groups/organization-groups.module').then((m) => m.OrganizationGroupsModule)
  },
  {
    path: "levels",
    loadChildren: () => import('src/app/main/company-profile/organization-levels/levels.module').then((m) => m.LevelsModule)
  },
  {
    path: "organization-hierarchy",
    loadChildren: () => import('src/app/main/company-profile/organization-hierarchy/organization-hierarchy.module').then((m) => m.OrganizationHierarchyModule)
  },
  {
    path : "depreciation-policy",
    loadChildren: () => import('src/app/main/company-profile/depreciation-policy/depreciation-policy.module').then((m) => m.DepreciationPolicyModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyProfileRoutingModule { }
