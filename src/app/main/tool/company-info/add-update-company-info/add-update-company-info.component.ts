import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { CompanyInfoDto, CompanyInfoDtoResponse } from 'src/app/main/shared/dtos/CompanyInfo/CompanyInfoDto';
import { emailRegex, noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-company-info',
  templateUrl: './add-update-company-info.component.html',
  styleUrls: ['./add-update-company-info.component.scss']
})
export class AddUpdateCompanyInfoComponent implements OnInit {

  companyInfoForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  companyInfoId!: number;
  fetchingData: boolean = false;
  userDetail: any = localStorage.getItem('userDetail')
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router) { }
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.companyInfoId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.companyInfoId;
    this.userDetail = JSON.parse(this.userDetail)
    this.initializesCompanyInfoForm();
    if (this.isEditMode) {
      this.companyInfoById()
    }
  }
  companyInfoById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }
    this.dataService.getTableData('Company/GetCompanyInfo', { get: 1, paginationParam })
      .pipe(
        map((suppliersList: CompanyInfoDtoResponse) =>
          suppliersList.data.find((supplier: CompanyInfoDto) => supplier.id == this.companyInfoId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {

          this.companyInfoForm.patchValue({
            id: res?.id,
            name: res?.name,
            address: res?.address,
            state: res?.state,
            pCode: res?.pCode,
            city: res?.city,
            country: res?.country,
            phoneNo: res?.phone,
            fax: res?.fax,
            imageToBase64: res?.imageBase64,
            // loginName: res?.loginName,
            email: res?.email,
          })
          this.image = res?.imageBase64
        }
      })
  }

  initializesCompanyInfoForm() {
    this.companyInfoForm = this.fb.group({
      id: [1],
      name: ['', [Validators.required, noWhitespaceValidator()]],
      address: [''],
      state: [''],
      pCode: [''],
      city: [''],
      country: [''],
      phoneNo: [''],
      fax: [''],
      imageToBase64: [''],
      var: [''],
      email: ['', Validators.pattern(emailRegex)],
    })
  }

  onSubmit() {
    if (this.companyInfoForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Company/UpdateCompanyInfo', { update: 1, ...this.companyInfoForm.value }) : this.dataService.getTableData('Company/InsertCompanyInfo', { add: 1, ...this.companyInfoForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/tool/company-info'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.companyInfoForm)
    }
  }

  image: any = ''
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image: string = e.target.result;
      this.image = base64Image;
      this.companyInfoForm.patchValue({
        imageToBase64: this.image
      })
      console.log(base64Image); // You can perform further operations with the base64 image
    };

    reader.readAsDataURL(file);
  }


}
