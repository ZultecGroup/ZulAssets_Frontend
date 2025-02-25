import { Component, Input, OnInit, ViewChild } from '@angular/core';
import
{
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { CustomvalidationService } from 'src/app/main/shared/service/customvalidation.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { UsersDto, UsersDtoResponse } from 'src/app/main/shared/dtos/Users/UsersDto';
import { RolesDto, RolesDtoResponse } from 'src/app/main/shared/dtos/Roles/RolesDto';

@Component({
  selector: 'app-create-application-user',
  templateUrl: './create-application-user.component.html',
  styleUrls: [ './create-application-user.component.scss' ],
})
export class CreateApplicationUserComponent implements OnInit
{
  applicationUserForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  brandId!: string;
  fetchingData: boolean = false;
  @ViewChild('password') public password: TextBoxComponent;
  @ViewChild('confirmPassword') public confirmPassword: TextBoxComponent;

  public roleList: any[] = [];
  public data: any= [];
  accessList: Array<Item> = [
    { text: 'Desktop Application', value: 1 },
    { text: 'Mobile Application', value: 2 },
    { text: 'Both', value: 3 },
  ];
  @Input('submitted') submitted = false;
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router,
    private customValidator: CustomvalidationService
  ) { }

  public ngAfterViewInit(): void
  {
    this.password.input.nativeElement.type = 'password';
    // this.confirmPassword.input.nativeElement.type = 'password';
  }

  public toggleVisibility(): void
  {
    const inputEl = this.password.input.nativeElement;

    if (inputEl.type === 'password')
    {
      inputEl.type = 'text';
    } else
    {
      inputEl.type = 'password';
    }
  }
  public toggleConfirmVisibility(): void
  {
    const inputEl = this.confirmPassword.input.nativeElement;

    if (inputEl.type === 'password')
    {
      inputEl.type = 'text';
    } else
    {
      inputEl.type = 'password';
    }
  }

  ngOnInit(): void
  {
    this.getUserRoleList();
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;



    this.brandId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;


    this.isEditMode = !!this.brandId;
    this.initializebrandForm();
    if (this.isEditMode)
    {
      this.getUserById();
    }
    // this.confirmPassword.input.nativeElement.type = "password";
  }
  getUserById()
  {
    this.fetchingData = true;

    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }

    this.dataService
      .getTableDataWithPagination('User/GetAllUsers', { get: 1, var: this.brandId, searching: 1, paginationParam })
      .pipe(
        map((userList: any) =>
          userList.data.find((user: any) => user.loginName == this.brandId)
        ),
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) =>
        {
          this.applicationUserForm.patchValue({
            roleID: res?.roleID,
            loginName: res?.loginName,
            userName: res?.userName,
            userAccess: res?.userAccess,
          });
          // this.initializebrandForm(res)
        }, complete: () =>
        {
          this.password.input.nativeElement.type = 'password';
          this.confirmPassword.input.nativeElement.type = 'password';
        }
      });
  }

  initializebrandForm(data?: any)
  {
    this.applicationUserForm = this.fb.group(
      {
        loginName: [ {value: '', disabled: this.isEditMode }, [Validators.required, noWhitespaceValidator()] ],
        userName: [ '', [Validators.required, noWhitespaceValidator()] ],
        password: new FormControl(
          '',
          Validators.compose([
            Validators.required, noWhitespaceValidator(),
            this.customValidator.patternValidator(),
          ])
        ),
        userAccess: [ '', [Validators.required, noWhitespaceValidator()] ],
        roleID: [ '', [Validators.required] ],
        confirmPassword: [ '', [Validators.required, noWhitespaceValidator()] ],
      },
      {
        validator: this.customValidator.MatchPassword(
          'password',
          'confirmPassword'
        ),
      }
    );
  }
  get registerFormControl()
  {
    return this.applicationUserForm.controls;
  }
  onSubmit()
  {
    if (this.applicationUserForm.valid)
    {
      console.log(this.applicationUserForm.value, 'test')
      if (
        this.applicationUserForm.get('password')?.value !=
        this.applicationUserForm.get('confirmPassword')?.value
      )
      {
        this.toast.show(
          'Please match the confirm password from password',
          'error'
        );
        return;
      }
      this.sendingRequest = true;
      console.log(this.applicationUserForm.getRawValue(), 'datad tets');

      const apiCall$ = this.isEditMode
        ? this.dataService.InsertNewUser('User/UpdateUser', {
          update: 1,
          ...this.applicationUserForm.getRawValue(),
        })
        : this.dataService.InsertNewUser('User/InsertUser', {
          add: 1,
          ...this.applicationUserForm.value,
        });
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.toast.show(res.message, 'success');
            this.router.navigate([ 'main/security/application-users' ]);
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
        {
          this.toast.show(err.title, 'error');
          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        },
      });
    } else
    {
      validateAllFormFields(this.applicationUserForm);
    }
  }
  searchString = '';

  public getUserRoleList()
  {
    this.dataService
      .getTableData('Roles/GetAllRoles', {
        get: 1,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: RolesDtoResponse) =>
        {
          console.log(res, 'this is the response');
          if (res)
          {
            this.roleList = res.data.reverse();
            this.data = this.roleList.slice();
            console.log(this.data);

          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  handleFilter(value: any)
  {
    this.data = this.roleList.filter(
      (s: any) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  back()
  {
    this.router.navigate([ 'main/security/application-users' ], this.isEditMode ? { queryParams: { currentPage: this.pagination.currentPage, pageSize: this.pagination.pageSize } } : undefined);
  }

}

interface Item
{
  text: string;
  value: number;
}
