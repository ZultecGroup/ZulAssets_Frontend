import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MainModule } from '../main.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActionCellModule } from './components/action-cell/action-cell.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ActionCellModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    extend :true
}),
  ],
  exports: [TranslateModule],
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<MainModule> {
    return {
      ngModule: SharedModule,
    }
  }
}

