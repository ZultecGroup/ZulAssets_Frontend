import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { DisposalMethodDto, DisposalMethodDtoResponse } from 'src/app/main/shared/dtos/DisposalMethod/DisposalMethodDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-disposal-methods',
  templateUrl: './add-update-disposal-methods.component.html',
  styleUrls: ['./add-update-disposal-methods.component.scss']
})
export class AddUpdateDisposalMethodsComponent implements OnInit {
  disposalForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  disposalId!: number;
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

    this.disposalId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.disposalId;
    this.initializeDisposalForm();
    if (this.isEditMode) {
      this.getDisposalById()
    }
  }
  getDisposalById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }

    this.dataService.getTableDataWithPagination('DisposalMethod/GetAllDispMethods', { get: 1, paginationParam })
      .pipe(
        map((disposalsList: DisposalMethodDtoResponse) =>
          disposalsList.data.find((disposal: DisposalMethodDto) => disposal.dispCode == this.disposalId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.disposalForm.patchValue({
            dispCode: res?.dispCode,
            dispDesc: res?.dispDesc
          })
        }
      })
  }

  initializeDisposalForm() {
    this.disposalForm = this.fb.group({
      dispCode: [0],
      dispDesc: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.disposalForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('DisposalMethod/UpdateDispMethod', { update: 1, ...this.disposalForm.value }) : this.dataService.getTableData('DisposalMethod/InsertDispMethod', { add: 1, ...this.disposalForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/disposal-methods'])
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
      validateAllFormFields(this.disposalForm)
    }
  }

}
