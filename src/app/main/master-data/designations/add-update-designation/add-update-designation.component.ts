import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { DesignationDtoResposne, DesignationDto } from 'src/app/main/shared/dtos/Designations/DesignationDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-designation',
  templateUrl: './add-update-designation.component.html',
  styleUrls: ['./add-update-designation.component.scss']
})
export class AddUpdateDesignationComponent implements OnInit {
  designationForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  designationId!: number;
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

    this.designationId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.designationId;
    this.initializeDesignationForm();
    if (this.isEditMode) {
      this.getDesignationById()
    }
  }
  getDesignationById() {
    this.fetchingData = true;
    let paginationParam = {

      pageIndex: 1,
      pageSize: 20,
    }

    this.dataService.getTableDataWithPagination('Designation/GetAllDesignations', { get: 1, var: this.designationId, searching: 1, paginationParam })
      .pipe(
        map((designationsList: DesignationDtoResposne) =>
          designationsList.data.find((designation: DesignationDto) => designation.designationID == this.designationId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.designationForm.patchValue({
            designationID: res?.designationID,
            description: res?.description
          })
        }
      })
  }

  initializeDesignationForm() {
    this.designationForm = this.fb.group({
      designationID: [0],
      description: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.designationForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Designation/UpdateDesignation', { update: 1, ...this.designationForm.value }) : this.dataService.getTableData('Designation/InsertDesignation', { add: 1, ...this.designationForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/designations'])
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
      validateAllFormFields(this.designationForm)
    }
  }
}
