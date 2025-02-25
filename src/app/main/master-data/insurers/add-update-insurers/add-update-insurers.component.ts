import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-insurers',
  templateUrl: './add-update-insurers.component.html',
  styleUrls: ['./add-update-insurers.component.scss']
})
export class AddUpdateInsurersComponent implements OnInit {
  insurerForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  insurerId!: number;
  fetchingData: boolean = false;
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router) { }

  ngOnInit(): void
  {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.insurerId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.insurerId;
    this.initializeInsurerForm();
    if (this.isEditMode) {
      this.getInsurerById()
    }
  }
  getInsurerById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }

    this.dataService.getTableDataWithPagination('Insurer/GetAllInsurers', { get: 1, paginationParam })
      .pipe(
        map(insurersList =>
          insurersList.data.find((insurer: any) => insurer.insCode == this.insurerId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.insurerForm.patchValue({
            insCode: res.insCode,
            insName: res.insName
          })
        }
      })
  }

  initializeInsurerForm() {
    this.insurerForm = this.fb.group({
      insCode: [0],
      insName: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.insurerForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Insurer/UpdateInsurer', { update: 1, ...this.insurerForm.value }) : this.dataService.getTableData('Insurer/InsertInsurer', { add: 1, ...this.insurerForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/insurers'])
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
      validateAllFormFields(this.insurerForm)
    }
  }

}
