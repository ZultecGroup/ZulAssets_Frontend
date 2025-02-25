import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'standard-reports',
    loadChildren: () => import('src/app/main/reporting/standard-reports/standard-reports.module').then((m) => m.StandardReportsModule),
  },
  {
    path: 'audit-status-reports',
    loadChildren: () => import('src/app/main/reporting/audit-status-reports/audit-status-reports.module').then((m) => m.AuditStatusReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
