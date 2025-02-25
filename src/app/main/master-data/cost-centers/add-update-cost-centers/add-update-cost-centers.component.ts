import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first, finalize } from 'rxjs';
import { CompanyDtoResponse } from 'src/app/main/shared/dtos/Companies/companyDtos';
import { CostCentersDtoResponse, CostCentersDto } from 'src/app/main/shared/dtos/CostCenters/CostCentersDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-cost-centers',
  templateUrl: './add-update-cost-centers.component.html',
  styleUrls: [ './add-update-cost-centers.component.scss' ]
})
export class AddUpdateCostCentersComponent implements OnInit
{

  costCenterForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  costId!: string;
  fetchingData: boolean = false;
  allCompanies: any;

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

    this.costId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.costId;
    this.initializecostCenterForm();
    this.getAllCompanies();
    if (this.isEditMode)
    {
      this.getcostById()
    }
  }
  getcostById()
  {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: 1,
      pageSize: 20
    }
    this.dataService.getTableDataWithPagination('CostCenter/GetAllCostCenters', { get: 1,var: this.costId, searching: 1,  paginationParam })
      .pipe(
        map((costsList: CostCentersDtoResponse) =>
          costsList.data.find((cost: CostCentersDto) => cost.costID == this.costId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          this.costCenterForm.patchValue({
            costID: res?.costID,
            companyId: res?.companyId,
            costName: res?.costName,
            costNumber: res?.costNumber
          })
        }
      })
  }

  initializecostCenterForm()
  {
    this.costCenterForm = this.fb.group({
      costID: [ 0 ],
      costName: [ '', [Validators.required, noWhitespaceValidator()] ],
      costNumber: [ '', [Validators.required, noWhitespaceValidator()] ],
      companyId: [ '', [Validators.required, noWhitespaceValidator()] ]
    })
  }
  getAllCompanies()
  {
    this.fetchingData = true
    this.dataService.getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: CompanyDtoResponse) =>
        {
          if (res)
          {
            this.allCompanies = res.data.reverse();
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  onSubmit()
  {
    if (this.costCenterForm.valid)
    {
      this.sendingRequest = true
      if (this.isEditMode)
      {
        this.costCenterForm.value.costCenterID = this.costId;
      }
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('CostCenter/UpdateCostCenter', { update: 1, ...this.costCenterForm.value }) : this.dataService.getTableData('CostCenter/InsertCostCenter', { add: 1, ...this.costCenterForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success')
              this.router.navigate([ 'main/master-data/cost-centers' ])
            } else
            {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) =>
          {
            this.toast.show(err.title, 'error')
            // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
          }
        })
    } else
    {
      validateAllFormFields(this.costCenterForm)
    }
  }
}
