import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { first, finalize, takeUntil, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CompanyDto, CompanyDtoResponse } from '../../shared/dtos/Companies/companyDtos';
import { GridDataService } from '../../shared/service/grid-data.service';
import { GridType } from '../../shared/dtos/GridType/GridType';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit
{
  gridData: CompanyDto[] = [];
  gridView: CompanyDto[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  companiesGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }
  isDestroyed$: Subject<boolean> = new Subject();
  private gridApi!: GridApi;
  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)

  constructor(private tableDataService: TableDataService, private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService, private router: Router,
    private route: ActivatedRoute, public GeneralService: GeneralService)
  {
    this.companiesGridCols = this.gridDataService.getColumnDefs(GridType.Companies, this.GeneralService.permissions.Companies)
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

    this.getAllCompanies(currentPage, pageSize)
    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.Companies)
      {
        this.onEditClick(data.rowData.companyId)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.Companies)
      {
        this.removeHandler(data.rowData.companyId)
      }
    })

    this.searchHandler();
  }

  private searchHandler()
  {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((term) =>
    {
      this.searchText = term;
      this.getAllCompanies(1, this.pagination.pageSize);
    });
  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getAllCompanies(currentPage: number, pageSize: number)
  {
    this.fetchingData = true;

    let payload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      }
    }

    if (this.searchText !== "") {
      payload = {
        ...payload,
        searching: 1,
        var: this.searchText,
      }
    }

    this.tableDataService.getTableDataWithPagination('Company/GetAllCompanies', payload)
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: CompanyDtoResponse) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.currentPage = currentPage
            this.pagination.pageSize = pageSize
            this.pagination.totalItems = res.totalRowsCount
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error'),
      })
  }

  onEditClick(Id: number)
  {
    this.router.navigate(
      [ 'edit', Id ],
      {
        relativeTo: this.route,
        queryParams: {
          currentPage: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
        },
      }
    );
  }


  removeHandler(companyId: any) {
    this.confirmationDialogService.confirm()
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = { companyId }
          this.tableDataService.getTableData('Company/DeleteCompany', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.getAllCompanies(this.pagination.currentPage, this.pagination.pageSize)
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      })
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay()
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  onPageChange(page: number)
  {
    this.pagination.currentPage = page
    this.getAllCompanies(this.pagination.currentPage, this.pagination.pageSize)
  }

  changePageSize(size: number)
  {
    this.resetPaginator();
    this.pagination.pageSize = size
    this.getAllCompanies(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
