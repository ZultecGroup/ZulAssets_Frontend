import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { CompanyDtoResponse } from 'src/app/main/shared/dtos/Companies/companyDtos';
import { GLCodesDto, GLCodesDtoResponse } from 'src/app/main/shared/dtos/GL-Codes/GLCodesDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
@Component({
  selector: 'app-add-update-gl-codes',
  templateUrl: './add-update-gl-codes.component.html',
  styleUrls: [ './add-update-gl-codes.component.scss' ]
})
export class AddUpdateGlCodesComponent implements OnInit
{
  glCodeForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  glCodeId!: number;
  fetchingData: boolean = false;
  companyList: any = [];
  public data: Array<{ name: string; id: number }>;
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router,
    private tableDataService: TableDataService) { }

  ngOnInit(): void
  {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.glCodeId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    console.log(this.glCodeId)
    this.isEditMode = !!this.glCodeId;
    this.initializeGlCodeForm();
    this.getAllCompanies();
    if (this.isEditMode)
    {
      this.getGlCodeById()
    }
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
            this.companyList = res.data.reverse()
            this.data = this.companyList.slice()
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  getGlCodeById()
  {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Designation/GetAllDesignations', { get: 1, paginationParam })
    this.tableDataService.getTableDataWithPagination('GLCodes/GetAllGLCodes', { get: 1, paginationParam })
      .pipe(
        map((glCodeList: GLCodesDtoResponse) =>
          glCodeList.data.find((glCode: GLCodesDto) => glCode.glCode == this.glCodeId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          console.log(res?.companyId)
          //this.data.find((x)=>)
          this.glCodeForm.patchValue({
            glCode: res?.glCode,
            companyId: res?.companyId,
            glDesc: res?.glDesc
          })
        }
      })
  }

  initializeGlCodeForm()
  {
    this.glCodeForm = this.fb.group({
      glCode: [ 0 ],
      companyId: [ '', [Validators.required, noWhitespaceValidator()] ],
      glDesc: [ '', [Validators.required, noWhitespaceValidator()] ]
    })
  }

  onSubmit()
  {
    if (this.glCodeForm.valid)
    {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('GLCodes/UpdateGLCode', { update: 1, ...this.glCodeForm.value }) : this.dataService.getTableData('GlCodes/InsertGLCode', { add: 1, ...this.glCodeForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success')
              this.router.navigate([ 'main/master-data/gl-codes' ])
            } else
            {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) =>
          {
            this.toast.show(err.title, 'error')
          }
        })
    } else
    {
      validateAllFormFields(this.glCodeForm)
    }
  }
  handleFilter(value: any)
  {
    this.data = this.companyList.filter(
      (s: any) => s.companyId
        .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }


}
