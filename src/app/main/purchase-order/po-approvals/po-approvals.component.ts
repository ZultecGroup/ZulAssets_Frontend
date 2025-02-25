import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  DataBindingDirective,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { first, finalize, take, Subject } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { ColDef } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { PoApprovalsDto, PoApprovalsDtoResponse } from '../../shared/dtos/PoApprovals/PoApprovalsDto';

@Component({
  selector: 'app-po-approvals',
  templateUrl: './po-approvals.component.html',
  styleUrls: ['./po-approvals.component.scss'],
})
export class PoApprovalsComponent implements OnInit {
  gridData: PoApprovalsDto[] = [];
  gridView: PoApprovalsDto[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('');
  poApprovalWithItems: any;
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  searchString = '';
  @ViewChild('grid', { static: false }) grid!: GridComponent;
  @ViewChild('innerGrid', { static: false }) innerGrid!: GridComponent;

  PoApprovalsGridCols: ColDef[] = [];

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

  private gridDataService = inject(GridDataService)


  constructor(
    private ngZone: NgZone,
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    public GeneralService: GeneralService
  ) {
    this.PoApprovalsGridCols = this.gridDataService.getColumnDefs(GridType.PoApprovals, this.GeneralService.permissions['PO Approvals']);
  }

  ngOnInit(): void {
    // this.gridView = [
    //   {
    //     poCode: 1,
    //     transferStatus: 'Pending',
    //     preparedBy: 'admin',
    //     approvedBy: '-',
    //     addCharges: '.00',
    //     amount: '.00',
    //     poDate: '17/06/2009',
    //     items: [
    //       {
    //         poItemCode: 1,
    //         itemQty: 15,
    //         itemCost: 100.00,
    //         itemDesc: 'Computer Set',
    //         itemCode: 1,
    //         poCode: 1
    //       },
    //       {
    //         poItemCode: 2,
    //         itemQty: 10,
    //         itemCost: 200.00,
    //         itemDesc: 'Laptop',
    //         itemCode: 2,
    //         poCode: 1
    //       }
    //     ]
    //   }
    // ]
    this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
  }

  ngAfterViewInit(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.grid.autoFitColumns();
        this.innerGrid.autoFitColumns();
      });
  }

  onExpand(e: any) {
    this.getAllPOItems(e.dataItem.poCode);
    console.log('Row expanded 123', e);
  }

  getAllAddresses(pageNumber: number, pageSize: number) {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: pageNumber,
      pageSize: pageSize,
    };
    this.tableDataService
      .getTableDataWithPagination('PO/GetPendingPOsForApproval', {
        get: 1,
        searching: 1,
        var: this.searchString,
        paginationParam
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: PoApprovalsDtoResponse) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.totalItems = res.totalRowsCount
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  Approve(event: any) {
    this.sendingRequest = true;
    this.poApprovalWithItems = event;
    this.getAllPOItems(event.poCode).then((x) => {
      const apiCall$ = this.tableDataService.getTableData(
        'PO/ApprovePOWithItems',
        {
          update: 1,
          poCode: event.poCode,
          addCharges: event.addCharges,
          amount: event.amount,
          approvedBy: 'admin',
          poDate: event.poDate,
          preparedBy: event.preparedby,
          poStatus: 2,
          poItemDetailsList: this.poApprovalWithItems.items,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
            this.toast.show(res.message, 'success');
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    });
  }
  getAllPOItems(poCode: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fetchingData = true;
      this.tableDataService
        .getTableData('PO/GetAllPOItems', {
          get: 1,
          searching: 1,
          var: this.searchString,
          poCode: poCode,
        })
        .pipe(
          first(),
          finalize(() => (this.fetchingData = false))
        )
        .subscribe({
          next: (res) => {
            if (res) {
              // let a =this.gridView.find(x=>x.poCode == poCode);
              this.gridView.forEach((element: PoApprovalsDto) => {
                if (element.poCode == poCode) {
                  this.poApprovalWithItems.items = res;
                  element = res;
                }
              });
              resolve('Success!');
              // a.item.push(res[0])
              console.log(res);
            } else {
              this.toast.show(res.message, 'error');
              reject(new Error('Error!'));
            }
          },
          error: (err) => {
            this.toast.show(err ?? 'Something went wrong!', 'error'),
              reject(new Error('Error!'));
          },
        });
    });
  }

  removeHandler(addressID: number) {
    this.confirmationDialogService.confirm().then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true;
        const payload = { addressID };
        this.tableDataService
          .getTableData('AddressTemplate/DeleteAddressTemplate', {
            delete: 1,
            ...payload,
          })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
              } else {
                this.toast.show(res.message, 'error');
              }
            },
            error: (err) =>
              this.toast.show(err ?? 'Something went wrong!', 'error'),
          });
      }
    });
  }

  onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'addressDesc',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }


  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
