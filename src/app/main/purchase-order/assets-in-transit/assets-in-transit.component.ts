import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize, Subject } from 'rxjs';
import { DetailMaintenanceService } from '../../asset/details-maintenance/detail-maintenance.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import
{
  emailRegex,
  validateAllFormFields,
} from '../../shared/helper/functions.component';
import { SelectionEvent } from '@progress/kendo-angular-grid';
import { NavigationExtras, Router } from '@angular/router';
import { ColDef, RowSelectedEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { ApprovedOrderDto, ApprovedOrderDtoResponse } from '../../shared/dtos/ApprovedOrder/ApprovedOrderDto';
import { PurchaseOrderDto, PurchaseOrderDtoResponse } from '../../shared/dtos/PurchaseOrder/PurchaseOrderDto';

@Component({
  selector: 'app-generate-po-assets',
  templateUrl: './assets-in-transit.component.html',
  styleUrls: [ './assets-in-transit.component.scss' ],
})
export class AssitsInTransitComponent implements OnInit
{
  fetchingData: boolean;
  approvedPurchaseOrderGridView: ApprovedOrderDto[] = [];
  purchaseOrderGridView: PurchaseOrderDto[] = [];
  id: number = 1;
  item: {};
  POCode: any;

  purchaseOrderGridCols: ColDef[] = [];
  approvedPurchaseOrderGridCols: ColDef[] = [];

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

  paginationSecond = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }
  private gridDataService = inject(GridDataService)
  transferStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private toast: toastService,
    public tableDataService: TableDataService,
    private router: Router,
    public GeneralService: GeneralService
  )
  {
    this.approvedPurchaseOrderGridCols = this.gridDataService.getColumnDefs(GridType.ApprovedPurchaseOrder, this.GeneralService.permissions['Assets In Transit ↵']);
    this.purchaseOrderGridCols = this.gridDataService.getColumnDefs(GridType.PurchaseOrder, this.GeneralService.permissions['Assets In Transit ↵']);
  }
  ngOnInit(): void
  {
    this.getAllApprovedPurchaseOrder(this.pagination.currentPage, this.pagination.pageSize);
  }

  getAllApprovedPurchaseOrder(pageNumber: number, pageSize: number)
  {
    let paginationParam = {
      pageIndex: pageNumber,
      pageSize: pageSize,
    };
    this.tableDataService
      .getTableDataWithPagination('PO/GetApprovedPOsForTransit', { get: 1, searching: 1, paginationParam })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: ApprovedOrderDtoResponse) =>
        {
          if (res)
          {
            this.approvedPurchaseOrderGridView = res.data;
            this.pagination.totalItems = res.totalRowsCount
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  selectedRowChange(selectionEvent: RowSelectedEvent)
  {
    this.POCode = selectionEvent.data.poCode
    this.transferStatus = selectionEvent.data.transferStatus
    this.getAllPurchaseOrderItem(this.pagination.currentPage, this.pagination.pageSize);
  }

  selectedItemRowChange(selectionEvent: RowSelectedEvent)
  {
    this.item = selectionEvent.data.dataItem;
    // selectionEvent.selectedRows[0].dataItem.poCode,
    // selectionEvent.selectedRows[0].dataItem.transferStatus
    console.log(selectionEvent);
  }
  transfer()
  {
    const navigationExtras: NavigationExtras = {
      state: {
        selectedItem: this.item,
        PoCode: this.POCode,
      }
    };
    this.router.navigate([ 'main/purchase-order/assets-in-transit/transfer' ], navigationExtras);
  }
  getAllPurchaseOrderItem(pageNumber: number, pageSize: number)
  {
    let poCode = this.POCode;
    let paginationParam = {
      pageIndex: pageNumber,
      pageSize: pageSize,
    };
    this.tableDataService
      .getTableDataWithPagination('PO/GetAllPOItems', { get: 1, searching: 1, poCode, paginationParam })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: PurchaseOrderDtoResponse) =>
        {
          if (res)
          {
            this.purchaseOrderGridView = res.data;
            this.paginationSecond.totalItems = res.totalRowsCount
            this.purchaseOrderGridView.map((option) =>
            {
              // New properties to be added
              const newPropsObj = {
                transferStatus: this.transferStatus,
              };

              // Assign new properties and return
              return Object.assign(option, newPropsObj);
            });
            // forEach(function (element) {
            //   element.Active = "false";
            // });
            // map(obj1 => ({ ...obj1, Active: 'false' }))
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }


  public pageChange(event: number, approved: boolean): void
  {
    if (approved)
    {
      this.pagination.currentPage = event
      this.getAllApprovedPurchaseOrder(this.pagination.currentPage, this.pagination.pageSize)
    }
    else
    {
      this.paginationSecond.currentPage = event
      this.getAllPurchaseOrderItem(this.paginationSecond.currentPage, this.paginationSecond.pageSize)
    }
  }

  pageSizeChange(event: number, approved: boolean)
  {
    this.resetPaginator()
    if (approved)
    {
      this.pagination.pageSize = event
      this.getAllApprovedPurchaseOrder(this.pagination.currentPage, this.pagination.pageSize)
    } else
    {
      this.paginationSecond.pageSize = event
      this.getAllPurchaseOrderItem(this.paginationSecond.currentPage, this.paginationSecond.pageSize)
    }
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
