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
  {
    path: 'asset-statement-reports',
    loadChildren: () => import('src/app/main/reporting/asset-statement-reports/asset-statement-reports.module').then((m) => m.AssetStatementReportsModule),
  },
  {
    path: 'quarterly-physical-report',
    loadChildren: () => import('src/app/main/reporting/quarterly-physical-report/quarterly-physical-report.module').then((m)=>m.QuarterlyPhysicalReportModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
