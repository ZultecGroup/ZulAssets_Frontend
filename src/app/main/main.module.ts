import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoggedinGuard } from './shared/guard/loggedin.guard';
import { CompanyInfoComponent } from './tool/company-info/company-info.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { MessageService } from '@progress/kendo-angular-l10n';
import { PopupModule } from "@progress/kendo-angular-popup";
import { LoaderComponent } from './shared/components/loader/loader.component';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const routes: Routes = [
  {
    path: 'authentication',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('src/app/main/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'main',
    component: MainComponent,
    canActivateChild: [LoggedinGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('src/app/main/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('src/app/main/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'file',
        loadChildren: () =>
          import('src/app/main/file/file.module').then(
            (m) => m.FileModule
          ),
      },
      {
        path: 'security',
        loadChildren: () =>
          import('src/app/main/security/security.module').then(
            (m) => m.SecurityModule
          ),
      },
      {
        path: 'master-data',
        loadChildren: () =>
          import('src/app/main/master-data/master-data.module').then(
            (m) => m.MasterDataModule
          ),
      },
      {
        path: 'tool',
        loadChildren: () =>
          import('src/app/main/tool/tool.module').then((m) => m.ToolModule),
      },
      {
        path: 'company-profile',
        loadChildren: () =>
          import('src/app/main/company-profile/company-profile.module').then(
            (m) => m.CompanyProfileModule
          ),
      },
      {
        path: 'purchase-order',
        loadChildren: () =>
          import('src/app/main/purchase-order/purchase-order.module').then(
            (m) => m.PurchaseOrderModule
          ),
      },
      {
        path: 'asset',
        loadChildren: () =>
          import('src/app/main/asset/asset.module').then((m) => m.AssetModule),
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('src/app/main/communication/communication.module').then(
            (m) => m.CommunicationModule
          ),
      },
      {
        path: 'reporting',
        loadChildren: () => 
        import('src/app/main/reporting/reporting.module').then(
          (m) => m.ReportingModule
        )
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication',
  },
];

@NgModule({
  declarations: [
    MainComponent,
    LoaderComponent
    // CompanyInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    ButtonsModule,
    NavigationModule,
    HttpClientModule,
    PopupModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate : false
    }),
    SharedModule.forRoot()
  ],
  providers : [
    MessageService
  ]
})

// export class LazyLoadedModule {
//   constructor(protected translateService: TranslateService) {
//       const currentLang = translateService.currentLang;
//       translateService.currentLang = '';
//       translateService.use(currentLang);
//   }
// }
export class MainModule {}
