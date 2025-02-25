import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { SuppliersDto, SuppliersDtoResponse } from 'src/app/main/shared/dtos/Suppliers/SuppliersDto';
import { emailRegex, noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';


@Component({
  selector: 'app-add-update-suppliers',
  templateUrl: './add-update-suppliers.component.html',
  styleUrls: ['./add-update-suppliers.component.scss']
})
export class AddUpdateSuppliersComponent implements OnInit {
  supplierForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  supplierId!: string;
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

    this.supplierId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.supplierId;
    this.initializesupplierForm();
    if (this.isEditMode) {
      this.getSupplierById()
    }
  }
  getSupplierById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: 1,
      pageSize: 20
    }
    this.dataService.getTableDataWithPagination('Supplier/GetAllSuppliers', { get: 1,var: this.supplierId, searching: 1, paginationParam })
      .pipe(
        map((suppliersList: SuppliersDtoResponse) =>
          suppliersList.data.find((supplier: SuppliersDto) => supplier.suppID == this.supplierId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.supplierForm.patchValue({
            suppID: res?.suppID,
            suppName: res?.suppName,
            suppPhone: res?.suppPhone,
            suppFax: res?.suppFax,
            suppCell: res?.suppCell,
            suppEmail: res?.suppEmail,
          })
        }
      })
  }

  initializesupplierForm() {
    this.supplierForm = this.fb.group({
      suppID: ['', [Validators.required, noWhitespaceValidator()]],
      suppName: ['', [Validators.required, noWhitespaceValidator()]],
      suppPhone: ['', Validators.pattern(/^\+?[0-9]*$/)],
      suppFax: [''],
      suppCell: ['', Validators.pattern(/^\+?[0-9]*$/)],
      suppEmail: ['', Validators.pattern(emailRegex)],
    })
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('supplier/UpdateSupplier', { update: 1, ...this.supplierForm.value }) : this.dataService.getTableData('Supplier/InsertSupplier', { add: 1, ...this.supplierForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/suppliers'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.supplierForm)
    }
  }

}
