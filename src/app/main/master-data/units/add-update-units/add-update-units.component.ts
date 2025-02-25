import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-units',
  templateUrl: './add-update-units.component.html',
  styleUrls: ['./add-update-units.component.scss']
})
export class AddUpdateUnitsComponent implements OnInit {
  unitForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  unitId!: number;
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

    this.unitId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.unitId;
    this.initializeunitForm();
    if (this.isEditMode) {
      this.getUnitById()
    }
  }
  getUnitById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }

    this.dataService.getTableDataWithPagination('Unit/GetAllUnits', { get: 1, paginationParam })
      .pipe(
        map(unitsList =>
          unitsList.data.find((unit: any) => unit.unitID == this.unitId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.unitForm.patchValue({
            unitID: res.unitID,
            unitDesc: res.unitDesc
          })
        }
      })
  }

  initializeunitForm() {
    this.unitForm = this.fb.group({
      unitID: [0],
      unitDesc: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.unitForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('unit/UpdateUnit', { update: 1, ...this.unitForm.value }) : this.dataService.getTableData('Unit/InsertUnit', { add: 1, ...this.unitForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/units'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.unitForm)
    }
  }

}
