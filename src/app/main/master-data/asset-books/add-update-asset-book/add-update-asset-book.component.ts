import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { AssetBooksDtoResponse, AssetBooksDto } from 'src/app/main/shared/dtos/AssetBooks/AssetBooksDto';
import { CompanyDtoResponse } from 'src/app/main/shared/dtos/Companies/companyDtos';
import { DepMethodDtoResponse } from 'src/app/main/shared/dtos/DepreciationMethods/DepreciationMethodDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-asset-book',
  templateUrl: './add-update-asset-book.component.html',
  styleUrls: [ './add-update-asset-book.component.scss' ]
})
export class AddUpdateAssetBookComponent implements OnInit
{

  bookForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  bookID!: number;
  fetchingData: boolean = false;
  allCompanyData: any;
  AllDepMethods: any;
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

    this.bookID = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.bookID;
    this.initializebookForm();
    this.getAllCompanies();
    this.getAllDepreciations();
    if (this.isEditMode)
    {
      this.GetAllBooksByID()
    }
  }
  getAllCompanies()
  {
    this.fetchingData = true;
    this.dataService
      .getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CompanyDtoResponse) =>
        {
          if (res)
          {
            this.allCompanyData = res.data.slice();
            console.log(this.allCompanyData)
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllDepreciations()
  {
    this.fetchingData = true;
    this.dataService
      .getTableData('DepreciationMethod/GetAllDepMethods', {
        get: 1,
        searching: 1
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: DepMethodDtoResponse) =>
        {
          if (res)
          {
            this.AllDepMethods = res.data.reverse();
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  GetAllBooksByID()
  {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Designation/GetAllDesignations', { get: 1, paginationParam })
    this.dataService.getTableDataWithPagination('Books/GetAllBooks', { get: 1, paginationParam })
      .pipe(
        map((booksList: AssetBooksDtoResponse) =>
          booksList.data.find((book: AssetBooksDto) => book.bookID == this.bookID)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          this.bookForm.patchValue({
            bookID: res?.bookID,
            description: res?.description,
            depCode: res?.depCode,
            companyID: res?.companyID,
          })
        }
      })
  }

  initializebookForm()
  {
    this.bookForm = this.fb.group({
      bookID: [ '' ],
      description: [ '', [Validators.required, noWhitespaceValidator()] ],
      depCode: [ '', [Validators.required, noWhitespaceValidator()] ],
      companyID: [ '', [Validators.required, noWhitespaceValidator()] ],
    })
  }

  onSubmit()
  {
    if (this.bookForm.valid)
    {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Books/UpdateBook', { update: 1, ...this.bookForm.value }) : this.dataService.getTableData('Books/InsertBook', { add: 1, ...this.bookForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success')
              this.router.navigate([ 'main/master-data/asset-book' ])
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
      validateAllFormFields(this.bookForm)
    }
  }

}
