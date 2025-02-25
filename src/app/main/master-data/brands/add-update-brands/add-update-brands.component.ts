import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first, finalize } from 'rxjs';
import { BrandsDtoResponse, BrandsDto } from 'src/app/main/shared/dtos/Brands/BrandsDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-brands',
  templateUrl: './add-update-brands.component.html',
  styleUrls: [ './add-update-brands.component.scss' ]
})
export class AddUpdateBrandsComponent implements OnInit
{

  brandForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  brandId!: number;
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

    this.brandId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.brandId;
    this.initializebrandForm();
    if (this.isEditMode)
    {
      console.log(this.pagination);

      this.getbrandById()
    }
  }
  getbrandById()
  {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: 1,
      pageSize: 20,
    }

    this.dataService.getTableDataWithPagination('Brands/GetAllBrands', { get: 1,var: this.brandId, searching: 1, paginationParam })
      .pipe(
        map((brandsList: BrandsDtoResponse) =>
          brandsList.data.find((brand: BrandsDto) =>
            brand.astBrandID == this.brandId
          )),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          this.brandForm.patchValue({
            astBrandID: res?.astBrandID,
            astBrandName: res?.astBrandName
          })
        }
      })
  }

  initializebrandForm()
  {
    this.brandForm = this.fb.group({
      astBrandID: [ 0 ],
      astBrandName: [ '', [Validators.required, noWhitespaceValidator()] ]
    })
  }

  onSubmit()
  {
    if (this.brandForm.valid)
    {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Brands/Updatebrand', { update: 1, ...this.brandForm.value }) : this.dataService.getTableData('Brands/Insertbrand', { add: 1, ...this.brandForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success')
              this.router.navigate([ 'main/master-data/brands' ])
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
      validateAllFormFields(this.brandForm)
    }
  }
}
