import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first, finalize } from 'rxjs';
import { AddressTemplateDto, AddressTemplateDtoResponse } from 'src/app/main/shared/dtos/AddressTemplate/AddressTemplateDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-address-template',
  templateUrl: './add-update-address-template.component.html',
  styleUrls: ['./add-update-address-template.component.scss']
})
export class AddUpdateAddressTemplateComponent implements OnInit {

  addressForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  addressId!: number;
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

    this.addressId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.addressId;
    this.initializeAddressForm();
    if (this.isEditMode) {
      this.getAddressById()
    }
  }
  getAddressById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }

    this.dataService.getTableDataWithPagination('AddressTemplate/GetAllAddressTemplates', { get: 1, paginationParam })
      .pipe(
        map((templateList: AddressTemplateDtoResponse) =>
          templateList.data.find((template: AddressTemplateDto) => template.addressID == this.addressId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.addressForm.patchValue({
            addressID: res?.addressID,
            addressDesc: res?.addressDesc
          })
        }
      })
  }

  initializeAddressForm() {
    this.addressForm = this.fb.group({
      addressID: [0],
      addressDesc: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('AddressTemplate/UpdateAddressTemplate', { update: 1, ...this.addressForm.value }) : this.dataService.getTableData('AddressTemplate/InsertAddressTemplate', { add: 1, ...this.addressForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/address-templates'])
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
      validateAllFormFields(this.addressForm)
    }
  }

}
