import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import
{
  first,
  finalize,
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { BarCodePolicyDto, BarCodePolicyDtoResponse } from '../../shared/dtos/BarCodingPolicy/BarCodePolicyDto';

@Component({
  selector: 'app-bar-coding-policy',
  templateUrl: './bar-coding-policy.component.html',
  styleUrls: [ './bar-coding-policy.component.scss' ],
})
export class BarCodingPolicyComponent implements OnInit
{
  gridData: BarCodePolicyDto[] = [];
  gridView: BarCodePolicyDto[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  barCodePolicyGridCols: ColDef[] = [];

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

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute, public GeneralService: GeneralService
  )
  {
    this.GeneralService.permissions['Barcode Company Policy'].delete = false;
    this.barCodePolicyGridCols = this.gridDataService.getColumnDefs(GridType.BarCodingPolicy, this.GeneralService.permissions['Barcode Company Policy'])
  }

  ngOnInit(): void
  {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

    this.getAllBarCodePolicy(currentPage, pageSize);
    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.BarCodingPolicy)
      {
        this.onEditClick(data.rowData.companyId)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.BarCodingPolicy)
      {
        this.removeHandler(data.rowData.companyId)
      }
    })

  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getAllBarCodePolicy(currentPage: number, pageSize: number)
  {
    this.fetchingData = true;

    this.tableDataService
      .getTableDataGet('BarcodeStructure/GetAllBarcodingPolicy')
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: BarCodePolicyDtoResponse) =>
        {
          if (res)
          {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount;
          }
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

  removeHandler(companyId: number)
  {
    console.log(companyId)
    this.confirmationDialogService.confirm().then((confirmed) =>
    {
      if (confirmed)
      {
        this.sendingRequest = true;
        const payload = { companyId };
        //BarcodePolicy/DeleteBarcodePolicy
        this.tableDataService
          .getTableData('Company/DeleteCompany', {
            delete: 1,
            ...payload,
          })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) =>
            {
              if (res && res.status === '200')
              {
                this.toast.show(res.message, 'success');
                this.getAllBarCodePolicy(this.pagination.currentPage, this.pagination.pageSize);
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

  onFilterTextBoxChanged(event: Event)
  {
    this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }


  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getAllBarCodePolicy(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllBarCodePolicy(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
