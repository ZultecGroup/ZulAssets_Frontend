import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from "@progress/kendo-angular-notification";
import { AuthService } from '../../shared/service/auth.service';
import { toastService } from '../../shared/toaster/toast.service';
import { noWhitespaceValidator } from '../../shared/helper/functions.component';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  setPasswordForm: FormGroup | any;

  constructor(
    private fb: FormBuilder,
    public notificationService: NotificationService,
    private router: Router,
    private toast: toastService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm() {
    this.setPasswordForm = this.fb.group({
      loginName: new FormControl(this.authService.forgotUserName, Validators.compose([Validators.required, noWhitespaceValidator()])),
      token: new FormControl('', Validators.compose([Validators.required, noWhitespaceValidator()])),
      newPassword: new FormControl('', Validators.compose([Validators.required, noWhitespaceValidator()]))
    });
  }

  setPassword() {
    if (this.setPasswordForm.valid) {
      this.authService.forgetPassword(this.setPasswordForm.value).subscribe((res: any) => {
        if (res.status == '200') {
          this.router.navigate(['/authentication/sign-in']);
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
    } else {
      this.toast.show('Please fill the all mandatory fields', 'error')
    }
  }


}
