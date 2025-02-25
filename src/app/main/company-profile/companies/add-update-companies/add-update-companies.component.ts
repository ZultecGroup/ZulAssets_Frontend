import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first, finalize } from 'rxjs';
import { CompanyDto, CompanyDtoResponse } from 'src/app/main/shared/dtos/Companies/companyDtos';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-companies',
  templateUrl: './add-update-companies.component.html',
  styleUrls: ['./add-update-companies.component.scss']
})
export class AddUpdateCompaniesComponent implements OnInit {

  companyForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  companyId!: number;
  fetchingData: boolean = false;

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.companyId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.companyId;
    this.initializeCompanyForm();
    if (this.isEditMode) {
      this.getCompanyById()
    }
  }

  getCompanyById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Company/GetAllCompanies', { get: 1, paginationParam })
      .pipe(
        map((companyList:  CompanyDtoResponse) =>
          companyList.data.find((company: CompanyDto) => company.companyId == this.companyId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.companyForm.patchValue({
            companyId: res?.companyId,
            companyCode: res?.companyCode,
            companyName: res?.companyName
          })
        }
      })
  }

  initializeCompanyForm() {
    this.companyForm = this.fb.group({
      companyId: [0],
      companyCode: ['', [Validators.required, noWhitespaceValidator()]],
      companyName: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ?
        this.dataService.getTableData('Company/UpdateCompany', { update: 1, ...this.companyForm.value }) :
        this.dataService.getTableData('Company/InsertCompany', { add: 1, ...this.companyForm.value });
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/company-profile/companies'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.companyForm)
    }
  }

}
