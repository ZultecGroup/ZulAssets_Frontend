import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { AstCodingDefDtoResponse, AstCodingDefinitionDto } from 'src/app/main/shared/dtos/AssetsCodingDefinition/AstCodingDefDto';
import { CompanyDtoResponse } from 'src/app/main/shared/dtos/Companies/companyDtos';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-assets-coding-definition',
  templateUrl: './add-update-assets-coding-definition.component.html',
  styleUrls: ['./add-update-assets-coding-definition.component.scss']
})
export class AddUpdateAssetsCodingDefinitionComponent implements OnInit {
  assetsCodingForm!: FormGroup;
  sendingRequest: boolean;
  isEditMode: any;
  assetCodingID: any;

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private fb: FormBuilder, private tableDataService: TableDataService, private toast: toastService, private router: Router,private route: ActivatedRoute) {

  }
  updateastcoding: any;
  fetchingData: boolean;
  Company: any;
  allCompanies: any;


  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.assetCodingID = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.assetCodingID;
    this.getAllCompanies();
    this.initializeAssetsCodingForm();
    if (this.isEditMode) {
      this.getAstCodingDefById();
    }
  }

  initializeAssetsCodingForm(data?: any) {
    this.assetsCodingForm = this.fb.group({
      assetCodingID: [''],
      status: [true],
      companyID: ['', [Validators.required]],
      startSerial: [null, [Validators.required]],
      endSerial: [null, [Validators.required]],
    }, { validators: greaterThanValidator });
  }
  getAstCodingDefById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.tableDataService.getTableDataWithPagination('Assets/GetAllAstCodingDef', { get: 1, paginationParam })
      .pipe(
        map((assetCodingsList: AstCodingDefDtoResponse) =>
        assetCodingsList.data.find((assetCoding: AstCodingDefinitionDto) => assetCoding.assetCodingID == this.assetCodingID)
        ),
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          this.assetsCodingForm.patchValue({
            assetCodingID: res?.assetCodingID,
            startSerial: res?.startSerial,
            endSerial: res?.endSerial,
            status: res?.status == 'Open' ? true : false,
            companyID: res?.companyId,
          });
        },
      });
  }
  getAllCompanies() {
    this.fetchingData = true
    this.tableDataService.getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: CompanyDtoResponse) => {
          if (res) {
            this.allCompanies = res.data
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  submit() {
    console.log('valis',this.assetsCodingForm.valid)
    const invalidFields = this.findInvalidControls();
      console.log('Invalid Fields:', invalidFields);
    if (this.assetsCodingForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.tableDataService.getTableData('Assets/UpdateAstCodingDef', { update: 1, ...this.assetsCodingForm.value }) : this.tableDataService.getTableData('Assets/InsertAstCodingDef', { add: 1, ...this.assetsCodingForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/company-profile/assets-coding-definition'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.assetsCodingForm)
    }
  }
  setAllValues(astID: any, arg1: boolean) {
    throw new Error('Method not implemented.');
  }
  findInvalidControls() {
    const invalidControls: { controlName: string; errors: any }[] = [];
    Object.keys(this.assetsCodingForm.controls).forEach((controlName) => {
      const control = this.assetsCodingForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push({
          controlName,
          errors: control.errors,
        });
      }
    });
    return invalidControls;
  }
}

function greaterThanValidator(group: FormGroup): ValidationErrors | null {
  const start_serial = group.get('startSerial')?.value;
  const end_serial = group.get('endSerial')?.value;
  console.log('start_serial',start_serial,'end_serial',end_serial)

  if (start_serial && end_serial && start_serial.value != null && end_serial.value != null && start_serial.value <= end_serial.value) {
    return { greaterThan: true };
  }

  return null;
}
