import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toastService } from '../../shared/toaster/toast.service';
import { NotificationService } from "@progress/kendo-angular-notification";
import { AuthService } from '../../shared/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { noWhitespaceValidator } from '../../shared/helper/functions.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {


  forgotPassworForm: FormGroup | any;

  constructor(
    private fb: FormBuilder,
    public notificationService : NotificationService ,
    private router: Router,
    private toast: toastService,
    public authService: AuthService,
    private translateService : TranslateService

  ) { }

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm() {
    this.forgotPassworForm = this.fb.group({
      loginName: new FormControl('', Validators.compose([Validators.required, noWhitespaceValidator()])),
    });
  }

  forgotPassword(){
    if(this.forgotPassworForm.valid){
      this.authService.forgotUserName = this.forgotPassworForm.value.loginName
      this.authService.GeneratePasswordToken(this.forgotPassworForm.value).subscribe((res: any) => {
        if (res.status == '200') {
          this.router.navigate(['/authentication/set-password']);
          this.toast.show(res.message, 'success')
        }
        else{
          this.toast.show(res.message, 'error')
        }
      },
        err => {
          this.toast.show(err.message, 'error')
        }
      )
    }else{
      this.toast.show('Please fill the mandatory fields', 'error')
    }
  }
  changeLangage(lang: string) {
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
 }

}
