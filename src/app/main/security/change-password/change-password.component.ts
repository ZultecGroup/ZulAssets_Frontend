import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { finalize, first, map } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { CustomvalidationService } from '../../shared/service/customvalidation.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  fetchingData: boolean = false;
  @ViewChild('password') public password: TextBoxComponent;
  @ViewChild('confirmPassword') public confirmPassword: TextBoxComponent;

  public ngAfterViewInit(): void {
    this.password.input.nativeElement.type = 'password';
    this.confirmPassword.input.nativeElement.type = 'password';
  }

  public toggleVisibility(): void {
    const inputEl = this.password.input.nativeElement;

    if (inputEl.type === 'password') {
      inputEl.type = 'text';
    } else {
      inputEl.type = 'password';
    }
  }
  public toggleConfirmVisibility(): void {
    const inputEl = this.confirmPassword.input.nativeElement;

    if (inputEl.type === 'password') {
      inputEl.type = 'text';
    } else {
      inputEl.type = 'password';
    }
  }
  constructor(
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit(): void {
    this.initializechangePasswordForm();
    this.changePasswordForm.patchValue({
      loginName: JSON.parse(localStorage.getItem('userObj')!).loginName,
    });
  }

  initializechangePasswordForm(data?: any) {
    this.changePasswordForm = this.fb.group({
      loginName: [{value:'', disabled: true}, [Validators.required, noWhitespaceValidator()]],
      oldPassword: ['', [Validators.required, noWhitespaceValidator()]],
      newPassword: ['', [Validators.required, noWhitespaceValidator(), this.customValidator.patternValidator()]],
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.dataService.getTableData(
        'User/ChangePassword',{TransactionUser: this.changePasswordForm.get('loginName')?.value,
        ...this.changePasswordForm.value}
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.initializechangePasswordForm();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.changePasswordForm);
    }
  }
}

interface Item {
  text: string;
  value: number;
}
