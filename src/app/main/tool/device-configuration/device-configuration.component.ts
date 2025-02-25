import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, first, Subject, takeUntil } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-device-configuration',
  templateUrl: './device-configuration.component.html',
  styleUrls: [ './device-configuration.component.scss' ]
})
export class DeviceConfigurationComponent implements OnInit
{
  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;

  searchText = '';

  deviceConfigGridCols: ColDef[] = [];
  searchSubject = new Subject<string>();

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

  constructor(private tableDataService: TableDataService, private toast: toastService, private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute, public GeneralService: GeneralService
  )
  {
    this.deviceConfigGridCols = this.gridDataService.getColumnDefs(GridType.DeviceConfig, this.GeneralService.permissions['Device Configuration']);
  }

  ngOnInit(): void
  {
    const queryParams = this.route.snapshot.queryParams as Params;

        const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
        const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

        this.getAllDevice(currentPage, pageSize)

    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.DeviceConfig)
      {
        this.onEditClick(data.rowData.deviceID)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.DeviceConfig)
      {
        this.removeHandler(data.rowData.deviceID)
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
        this.getAllDevice(1, this.pagination.pageSize);
      });
    }


  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getAllDevice(currentPage: number, pageSize: number)
  {
    this.fetchingData = true
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
    this.tableDataService.getTableDataWithPagination('DeviceConfiguration/GetAllDevices', payload)
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.totalItems = res.totalRowsCount

          } else
          {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  onEditClick(Id: number)
  {
    this.router.navigate([ 'edit', Id ], { relativeTo: this.route });
  }

  removeHandler(deviceID: number)
  {
    this.confirmationDialogService.confirm()
      .then((confirmed) =>
      {
        if (confirmed)
        {
          this.sendingRequest = true;
          const payload = { deviceID }
          this.tableDataService.getTableData('DeviceConfiguration/DeleteDevice', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) =>
              {
                if (res && res.status === '200')
                {
                  this.toast.show(res.message, 'success')
                  this.getAllDevice(this.pagination.currentPage, this.pagination.pageSize);
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

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    // this.gridApi.showLoadingOverlay()
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getAllDevice(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllDevice(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
