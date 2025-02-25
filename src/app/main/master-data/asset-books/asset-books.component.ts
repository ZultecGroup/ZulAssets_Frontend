import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { debounceTime, distinctUntilChanged, finalize, first, Subject, takeUntil } from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { AssetBooksDto, AssetBooksDtoResponse } from '../../shared/dtos/AssetBooks/AssetBooksDto';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';


@Component({
  selector: 'app-asset-books',
  templateUrl: './asset-books.component.html',
  styleUrls: ['./asset-books.component.scss']
})
export class AssetBooksComponent implements OnInit {

  gridData: AssetBooksDto[] = [];
  gridView: AssetBooksDto[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  assetBooksGridCols: ColDef[] = [];
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
  faFileExcel = faFileExcel
  faFilePdf = faFilePdf
  private gridApi!: GridApi;

  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute,
    public GeneralService: GeneralService
  )
  {
    this.assetBooksGridCols = this.gridDataService.getColumnDefs(GridType.AssetBooks, this.GeneralService.permissions['Asset Books']);
  }

  ngOnInit(): void
  {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

    this.GetAllBooks(currentPage, pageSize)
    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.AssetBooks)
      {
        this.onEditClick(data.rowData.bookID)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.AssetBooks)
      {
        this.removeHandler(data.rowData.bookID)
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
      this.GetAllBooks(1, this.pagination.pageSize);
    });
  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  GetAllBooks(currentPage: number, pageSize: number) {
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

    this.tableDataService.getTableDataWithPagination('Books/GetAllBooks', payload)
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: AssetBooksDtoResponse) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
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

  removeHandler(bookID: number) {
    this.confirmationDialogService.confirm()
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = { bookID }
          this.tableDataService.getTableData('Books/DeleteBook', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.GetAllBooks(this.pagination.currentPage, this.pagination.pageSize)
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

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.GetAllBooks(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.GetAllBooks(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  exportToCSV(): void
  {
    this.gridDataService.exportToCSV(this.gridApi, GridType.AssetBooks);
  }
}
