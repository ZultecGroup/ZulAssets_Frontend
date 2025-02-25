import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { DepMethodDtoResponse, DepreciationMethodDto } from 'src/app/main/shared/dtos/DepreciationMethods/DepreciationMethodDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';


@Component({
  selector: 'app-add-update-depreciation-methods',
  templateUrl: './add-update-depreciation-methods.component.html',
  styleUrls: ['./add-update-depreciation-methods.component.scss']
})
export class AddUpdateDepreciationMethodsComponent implements OnInit {
  depreciationForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  depreciateId!: number;
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

    this.depreciateId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.depreciateId;
    this.initializeDepreciateForm();
    if (this.isEditMode) {
      this.getDepreciateById()
    }
  }
  getDepreciateById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Designation/GetAllDesignations', { get: 1, paginationParam })
    this.dataService.getTableDataWithPagination('DepreciationMethod/GetAllDepMethods', { get: 1, paginationParam })
      .pipe(
        map((depreciatesList: DepMethodDtoResponse) =>
          depreciatesList.data.find((depreciate: DepreciationMethodDto) => depreciate.depCode == this.depreciateId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.depreciationForm.patchValue({
            depCode: res?.depCode,
            depDesc: res?.depDesc
          })
        }
      })
  }

  initializeDepreciateForm() {
    this.depreciationForm = this.fb.group({
      depCode: [0],
      depDesc: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.depreciationForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('DepreciationMethod/UpdateDepMethod', { update: 1, ...this.depreciationForm.value }) : this.dataService.getTableData('DepreciationMethod/InsertDepMethod', { add: 1, ...this.depreciationForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/depreciation-methods'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
            // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
          }
        })
    } else {
      validateAllFormFields(this.depreciationForm)
    }
  }
}
