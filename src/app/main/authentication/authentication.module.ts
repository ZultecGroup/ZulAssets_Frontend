import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SetPasswordComponent } from './set-password/set-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationModule } from "@progress/kendo-angular-notification";
import { AuthService } from '../shared/service/auth.service';
import { HttpService } from '../shared/service/http.service';
import { SharedModule } from '../shared/shared.module';
import { MessageService } from '@progress/kendo-angular-l10n';


const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'set-password',
    component: SetPasswordComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '**',
    redirectTo: 'sign-in'
  },
]

@NgModule({
  declarations: [
    AuthenticationComponent,
    SignInComponent,
    ForgotPasswordComponent,
    SetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonsModule,
    InputsModule,
    LabelModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    SharedModule
  ],
  providers : [
    MessageService
  ]
})
export class AuthenticationModule { }
