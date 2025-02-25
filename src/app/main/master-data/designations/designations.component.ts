import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { debounceTime, distinctUntilChanged, finalize, first, Subject, takeUntil } from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { DesignationDto, DesignationDtoResposne } from '../../shared/dtos/Designations/DesignationDto';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { GeneralService } from '../../shared/service/general.service';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: [ './designations.component.scss' ],
})
export class DesignationsComponent implements OnInit
{
  gridData: DesignationDto[] = [];
  gridView: DesignationDto[] = [];
  searchText: string = '';
  searchSubject = new Subject<string>();
  fetchingData: boolean = false;
  sendingRequest: boolean = false;

  designationsGridCols: ColDef[] = [];

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
    public generalService: GeneralService
  )
  {
    this.designationsGridCols = this.gridDataService.getColumnDefs(GridType.Designation, this.generalService.permissions.Designations);
  }

  ngOnInit(): void
  {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

    this.getAllDesignations(currentPage, pageSize, this.searchText);

    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.Designation)
      {
        this.onEditClick(data.rowData.designationID)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.Designation)
      {
        this.removeHandler(data.rowData.designationID)
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
      this.getAllDesignations(1, this.pagination.pageSize, term);
    });
  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getAllDesignations(currentPage: number, pageSize: number, searchText: string)
  {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: currentPage,
      pageSize: pageSize,
    };
    this.tableDataService
      .getTableDataWithPagination('Designation/GetAllDesignations', {
        get: 1,
        searching: 1,
        var: searchText,
        paginationParam,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: DesignationDtoResposne) =>
        {
          this.gridData = res.data.reverse();
          this.gridView = this.gridData.reverse();
          this.pagination.currentPage = currentPage;
          this.pagination.pageSize = pageSize;
          this.pagination.totalItems = res.totalRowsCount;
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
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

  removeHandler(id: number)
  {
    this.confirmationDialogService.confirm().then((confirmed) =>
    {
      if (confirmed)
      {
        this.sendingRequest = true;
        const payload = { designationID: id };
        this.tableDataService
          .getTableData('Designation/DeleteDesignation', {
            delete: 1,
            ...payload,
          })
          .pipe(
            first(),
            finalize(() => (this.sendingRequest = false))
          )
          .subscribe({
            next: (res) =>
            {
              if (res && res.status === '200')
              {
                this.toast.show(res.message, 'success');
                this.getAllDesignations(this.pagination.currentPage, this.pagination.pageSize, this.searchText);
              } else
              {
                this.toast.show(res.message, 'error');
              }
            },
            error: (err) =>
              this.toast.show(err ?? 'Something went wrong!', 'error'),
          });
      }
    });
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
    this.getAllDesignations(this.pagination.currentPage, this.pagination.pageSize, this.searchText);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllDesignations(this.pagination.currentPage, this.pagination.pageSize, this.searchText)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  exportToCSV(): void
  {
    this.gridDataService.exportToCSV(this.gridApi, GridType.Designation);
  }
}
