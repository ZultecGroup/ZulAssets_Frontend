import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { JwtInterceptor } from './main/shared/interceptor/intercept.service';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

// import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DateInputsModule,
    NotificationModule,
    DialogModule,
    HttpClientModule,
    FormsModule
  //   TranslateModule.forRoot({
  //     defaultLanguage: 'en',
  //     loader: {
  //         provide: TranslateLoader,
  //         useFactory: HttpLoaderFactory,
  //         deps: [HttpClient]
  //     },
  //     isolate: false
  // }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent],
})
export class AppModule {}
