import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { debounceTime, distinctUntilChanged, finalize, first, Subject, takeUntil } from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import { CompanyInfoDto, CompanyInfoDtoResponse } from '../../shared/dtos/CompanyInfo/CompanyInfoDto';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: [ './company-info.component.scss' ]
})
export class CompanyInfoComponent implements OnInit
{
  gridData: CompanyInfoDto[] = [];
  gridView: CompanyInfoDto[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  companyInfoGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }
  isDestroyed$: Subject<boolean> = new Subject();
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }
  private gridApi!: GridApi;

  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private tableDataService: TableDataService, private toast: toastService,
    private router: Router, private route: ActivatedRoute,
    public GeneralService: GeneralService
  )
  {

    this.companyInfoGridCols = this.gridDataService.getColumnDefs(GridType.CompanyInfo, this.GeneralService.permissions['Company Info']);
  }

  ngOnInit(): void
  {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

    this.getCompanyInfo(currentPage, pageSize)
    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.CompanyInfo)
      {
        this.onEditClick(data.rowData.id)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.CompanyInfo)
      {
        this.removeHandler(data.rowData.id)
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
      this.getCompanyInfo(1, this.pagination.pageSize);
    });
  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getCompanyInfo(currentPage: number, pageSize: number)
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

    this.tableDataService.getTableDataWithPagination('Company/GetCompanyInfo', payload)
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: CompanyInfoDtoResponse) =>
        {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse()
            this.pagination.currentPage = currentPage
            this.pagination.pageSize = pageSize
            this.pagination.totalItems = res.totalRowsCount
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }


  removeHandler(suppID: number)
  {
    this.confirmationDialogService.confirm()
      .then((confirmed) =>
      {
        if (confirmed)
        {
          this.sendingRequest = true;
          const payload = { suppID }
          this.tableDataService.getTableData('Supplier/DeleteSupplier', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) =>
              {
                if (res && res.status === '200')
                {
                  this.toast.show(res.message, 'success')
                  this.getCompanyInfo(this.pagination.currentPage, this.pagination.pageSize)
                } else
                {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      });
  }

  onEditClick(Id: number)
  {
    this.router.navigate([ 'edit', Id ], { relativeTo: this.route });
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay()
    this.gridApi.sizeColumnsToFit()
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getCompanyInfo(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getCompanyInfo(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

}
